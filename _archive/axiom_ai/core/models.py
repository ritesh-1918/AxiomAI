from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class ModelTier(str, Enum):
    SMALL = "small-fast"
    LARGE = "large-reasoning"

class RouteRequest(BaseModel):
    prompt: str = Field(..., description="The user input prompt to process")
    model_override: Optional[ModelTier] = Field(None, description="Force a specific model tier")

class RouteMetadata(BaseModel):
    complexity_score: float
    selected_tier: ModelTier
    routing_reason: str
    processing_time_ms: float

class LLMResponse(BaseModel):
    content: str
    metadata: RouteMetadata
