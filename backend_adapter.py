#!/usr/bin/env python3
"""
Backend adapter to bridge netquery MCP server with universal-agent-chat frontend.
Converts netquery's MCP protocol responses to the format expected by the React frontend.
"""

import asyncio
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Universal Agent Chat - Netquery Adapter")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    diagram_id: Optional[str] = None
    method: Optional[str] = "auto"
    explanation_detail: Optional[str] = "basic"

class ChatResponse(BaseModel):
    response: str
    explanation: str
    results: Optional[list] = None
    visualization_path: Optional[str] = None

class NetqueryMCPClient:
    """Client to communicate with real netquery MCP server."""
    
    def __init__(self, netquery_path: str = "/Users/qiyao/Code/netquery"):
        self.netquery_path = netquery_path
    
    async def query(self, message: str, include_explanation: bool = True) -> Dict[str, Any]:
        """Send query to real netquery MCP server and get response."""
        try:
            # Use netquery's CLI interface with timeout for reliability
            process = await asyncio.create_subprocess_exec(
                "bash", "-c", 
                f'cd {self.netquery_path} && source .venv/bin/activate && timeout 30s python gemini_cli.py "{message}"',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                error_msg = stderr.decode().strip() if stderr else "Unknown error"
                logger.error(f"Netquery CLI error: {error_msg}")
                raise Exception(f"Netquery query failed: {error_msg}")
            
            response_text = stdout.decode().strip()
            if not response_text:
                raise Exception("Empty response from netquery")
            
            logger.info(f"Netquery response received: {len(response_text)} characters")
            return [{"type": "text", "text": response_text}]
            
        except Exception as e:
            logger.error(f"Netquery client error: {e}")
            raise

# Initialize netquery client
netquery_client = NetqueryMCPClient()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Handle chat requests from the React frontend."""
    try:
        logger.info(f"Processing query: {request.message[:80]}...")
        
        # Determine if we need detailed explanation
        include_explanation = request.explanation_detail != "basic"
        
        # Query netquery MCP server
        mcp_response = await netquery_client.query(
            request.message, 
            include_explanation=include_explanation
        )
        
        # Extract text content from MCP response
        response_text = ""
        if isinstance(mcp_response, list) and len(mcp_response) > 0:
            response_text = mcp_response[0].get("text", "")
        elif isinstance(mcp_response, dict):
            response_text = mcp_response.get("text", str(mcp_response))
        else:
            response_text = str(mcp_response)
        
        # Parse the response to extract components
        parsed = parse_netquery_response(response_text)
        
        return ChatResponse(
            response=parsed["response"],
            explanation=parsed["explanation"], 
            results=parsed["results"],
            visualization_path=parsed.get("visualization_path")
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diagrams")
async def list_diagrams():
    """List available diagrams (for compatibility - netquery doesn't use diagrams)."""
    return []


def parse_netquery_response(response_text: str) -> Dict[str, Any]:
    """Parse netquery formatted response into components for the frontend."""
    try:
        # Initialize components
        response = ""
        explanation = ""
        results = None
        
        # Split response into sections
        sections = response_text.split('\n## ')
        
        # First section before any ## headers is the main response
        if sections:
            response = sections[0].strip()
        
        # Look for markdown table in response and extract it for JSON conversion
        if '|' in response_text and '---' in response_text:
            results = parse_markdown_table_to_json(response_text)
        
        # Remove the markdown table from the response text to avoid duplication
        # Find the table boundaries and remove it
        lines = response_text.split('\n')
        filtered_lines = []
        in_table = False
        
        for line in lines:
            # Start of table (header row with |)
            if '|' in line and not in_table and '---' not in line:
                in_table = True
                continue
            # Table separator row
            elif '---' in line and '|' in line:
                continue
            # End of table (empty line after table rows)
            elif in_table and (not line.strip() or ('|' not in line and line.strip())):
                in_table = False
                if line.strip():  # Keep the line if it's not empty (analysis section starts)
                    filtered_lines.append(line)
                continue
            # Skip table rows
            elif in_table and '|' in line:
                continue
            else:
                filtered_lines.append(line)
        
        # Rejoin the text without the table
        response_text_no_table = '\n'.join(filtered_lines)
        
        # Split response into sections again (without table)
        sections = response_text_no_table.split('\n## ')
        
        # First section before any ## headers is the main response
        if sections:
            response = sections[0].strip()
        
        # Look for specific sections
        for section in sections[1:]:  # Skip first section
            if section.startswith('SQL Query'):
                # Extract and clean SQL from code block
                lines = section.split('\n')
                sql_lines = []
                in_code_block = False
                for line in lines:
                    if line.strip().startswith('```sql'):
                        in_code_block = True
                        continue
                    elif line.strip() == '```':
                        in_code_block = False
                        continue
                    elif in_code_block:
                        sql_lines.append(line.strip())  # Clean up spaces
                
                if sql_lines:
                    # Join with proper spacing and format
                    clean_sql = '\n'.join(sql_lines).strip()
                    explanation += f"**SQL Query:**\n```sql\n{clean_sql}\n```\n\n"
            
            elif section.startswith('Explanation'):
                # Remove "Explanation:" header and make first line bold
                content = section[11:].strip()
                # Make the first line (SQL breakdown intro) bold
                lines = content.split('\n')
                if lines and "Here's a breakdown of the SQL query:" in lines[0]:
                    lines[0] = f"**{lines[0]}**"
                content = '\n'.join(lines)
                explanation += f"{content}\n\n"
            
            elif section.startswith('Process'):
                explanation += f"**Process:**\n{section[7:].strip()}\n\n"
            
            elif section.startswith('Analysis'):
                # Add proper line breaks for Analysis section
                analysis_content = section[8:].strip()
                # Replace periods followed by capital letters with period + newline
                import re
                analysis_content = re.sub(r'\.(\s+)([A-Z])', r'.\n\n\2', analysis_content)
                explanation += f"**Analysis:**\n\n{analysis_content}\n\n"
        
        return {
            "response": response,
            "explanation": explanation.strip(),
            "results": results
        }
        
    except Exception as e:
        logger.warning(f"Failed to parse netquery response: {e}")
        return {
            "response": response_text,
            "explanation": "",
            "results": None
        }

def parse_markdown_table_to_json(text: str) -> Optional[list]:
    """Extract JSON data from markdown table in netquery response."""
    try:
        lines = text.split('\n')
        table_lines = []
        in_table = False
        
        for line in lines:
            if '|' in line and not in_table:
                in_table = True
                table_lines.append(line)
            elif '|' in line and in_table:
                table_lines.append(line)
            elif in_table and '|' not in line and line.strip():
                break  # End of table
        
        if len(table_lines) < 2:
            return None
        
        # Parse header
        headers = [h.strip() for h in table_lines[0].split('|')[1:-1]]
        
        # Parse data rows (skip header and separator)
        results = []
        for line in table_lines[2:]:
            if '|' not in line:
                continue
            values = [v.strip() for v in line.split('|')[1:-1]]
            if len(values) == len(headers):
                row = dict(zip(headers, values))
                results.append(row)
        
        return results if results else None
        
    except Exception as e:
        logger.warning(f"Failed to parse markdown table: {e}")
        return None

if __name__ == "__main__":
    logger.info("Starting Universal Agent Chat - Netquery Adapter")
    uvicorn.run(app, host="0.0.0.0", port=8000)