#!/usr/bin/env python3
"""
Backend adapter to bridge Netquery FastAPI server with universal-agent-chat frontend.
Uses Netquery's new FastAPI endpoints for faster, more reliable communication.
"""

import asyncio
import logging
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Universal Agent Chat - Netquery FastAPI Adapter")

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
    method: Optional[str] = "auto"

class ChatResponse(BaseModel):
    response: str
    explanation: str
    results: Optional[list] = None
    visualization_path: Optional[str] = None
    visualization: Optional[dict] = None  # LLM-suggested visualization
    display_info: Optional[dict] = None  # Display guidance for frontend
    query_id: Optional[str] = None  # For download functionality

class NetqueryFastAPIClient:
    """Client to communicate with Netquery FastAPI server."""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    async def query(self, message: str) -> Dict[str, Any]:
        """Send query to Netquery FastAPI server and get complete response."""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:

                # Step 1: Generate SQL
                logger.info(f"Generating SQL for: {message[:80]}...")
                generate_response = await client.post(
                    f"{self.base_url}/api/generate-sql",
                    json={"query": message}
                )
                generate_response.raise_for_status()
                generate_data = generate_response.json()

                query_id = generate_data["query_id"]
                sql = generate_data["sql"]

                # Step 2: Execute and get preview
                logger.info(f"Executing SQL for query_id: {query_id}")
                execute_response = await client.get(
                    f"{self.base_url}/api/execute/{query_id}"
                )
                execute_response.raise_for_status()
                execute_data = execute_response.json()

                # Step 3: Get interpretation
                logger.info(f"Getting interpretation for query_id: {query_id}")
                interpret_response = await client.post(
                    f"{self.base_url}/api/interpret/{query_id}"
                )
                interpret_response.raise_for_status()
                interpretation_data = interpret_response.json()

                # Format the response for the frontend
                return self._format_response(
                    message=message,
                    sql=sql,
                    execute_data=execute_data,
                    interpretation_data=interpretation_data,
                    query_id=query_id
                )

        except httpx.HTTPError as e:
            logger.error(f"HTTP error communicating with Netquery API: {e}")
            raise Exception(f"Netquery API error: {e}")
        except Exception as e:
            logger.error(f"Netquery client error: {e}")
            raise

    def _format_response(self, message: str, sql: str, execute_data: dict,
                        interpretation_data: dict = None, query_id: str = None) -> Dict[str, Any]:
        """Format the API responses into the format expected by the frontend."""

        # Extract basic info
        data = execute_data.get("data", [])
        total_count = execute_data.get("total_count")
        columns = execute_data.get("columns", [])
        truncated = execute_data.get("truncated", False)

        # Create response summary
        if data:
            count_text = f"{total_count}" if total_count is not None else "1000+"
            response_summary = f"Found {count_text} rows"
            if truncated:
                response_summary += f" (showing first {len(data)})"
        else:
            response_summary = "No data found matching your query"

        # Build explanation
        explanation = f"**SQL Query:**\n```sql\n{sql}\n```\n\n"

        # Add interpretation if available
        if interpretation_data:
            interp = interpretation_data.get("interpretation", {})
            summary = interp.get("summary", "")
            findings = interp.get("key_findings", [])

            if summary:
                explanation += f"**Summary**\n{summary}\n\n"

            if findings:
                explanation += "**Key Findings:**\n"
                for i, finding in enumerate(findings, 1):
                    explanation += f"{i}. {finding}\n"
                explanation += "\n"

            # Add visualization info if available
            viz = interpretation_data.get("visualization")
            if viz:
                explanation += f"**Suggested Visualization:**\n"
                explanation += f"- {viz['type'].title()} chart: {viz['title']}\n"
                config = viz.get('config', {})
                if config.get('reason'):
                    explanation += f"- {config['reason']}\n"
                explanation += "\n"

            # Show analysis limitations only when dataset > 100 rows
            if total_count and total_count > 100:
                explanation += f"**Analysis Note:** Insights based on first 100 rows of {total_count} rows. Download full dataset for complete analysis.\n\n"
            elif total_count is None:  # >1000 rows case
                explanation += "**Analysis Note:** Insights based on first 100 rows of more than 1000 rows. Download full dataset for complete analysis.\n\n"


        # Simplified approach: Return all data (up to 30 rows max)
        # Frontend will handle showing 10 initially, then all 30 on scroll
        max_display_rows = 30
        display_data = data[:max_display_rows]

        display_info = {
            "total_rows": len(display_data),
            "initial_display": 10,  # Frontend should show first 10 rows initially
            "max_display": max_display_rows,
            "has_scroll_data": len(display_data) > 10,  # True if there are more rows to reveal on scroll
            "total_in_dataset": total_count if total_count is not None else "1000+"
        }

        # Extract visualization if available
        visualization = None
        if interpretation_data:
            visualization = interpretation_data.get("visualization")

        return {
            "response": response_summary,
            "explanation": explanation,
            "results": display_data,
            "visualization_path": None,  # Could be enhanced later with actual chart generation
            "visualization": visualization,
            "display_info": display_info,
            "query_id": query_id,  # For frontend download functionality
            "metadata": {
                "sql": sql,
                "total_count": total_count,
                "columns": columns,
                "truncated": truncated,
                "interpretation": interpretation_data,
                "query_id": query_id
            }
        }

# Initialize netquery client
netquery_client = NetqueryFastAPIClient()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Handle chat requests from the React frontend."""
    try:
        logger.info(f"Processing query: {request.message[:80]}...")

        # Query netquery FastAPI server
        response_data = await netquery_client.query(request.message)

        return ChatResponse(
            response=response_data["response"],
            explanation=response_data["explanation"],
            results=response_data["results"],
            visualization_path=response_data["visualization_path"],
            visualization=response_data["visualization"],
            display_info=response_data["display_info"],
            query_id=response_data["query_id"]
        )

    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process query: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test connection to Netquery API
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{netquery_client.base_url}/health")
            response.raise_for_status()
            netquery_health = response.json()

        return {
            "status": "healthy",
            "netquery_api": "connected",
            "netquery_cache_size": netquery_health.get("cache_size", 0)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "netquery_api": "disconnected",
            "error": str(e)
        }

if __name__ == "__main__":
    print("🚀 Starting Universal Agent Chat - Netquery FastAPI Adapter")
    print("📡 Will connect to Netquery API at: http://localhost:8000")
    print("🌐 Frontend should connect to: http://localhost:8001")
    print("\nMake sure Netquery FastAPI server is running:")
    print("  cd /Users/qiyao/Code/netquery")
    print("  python -m uvicorn src.api.server:app --reload --port 8000")
    print()

    uvicorn.run("netquery_server:app", host="0.0.0.0", port=8001, reload=True)