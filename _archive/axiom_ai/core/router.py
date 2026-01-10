import time
from .models import ModelTier, RouteRequest, LLMResponse, RouteMetadata
from .classifier import ComplexityClassifier
from ..clients.llm_clients import SmallLLMClient, LargeLLMClient

class LLMRouter:
    def __init__(self):
        self.classifier = ComplexityClassifier()
        self.small_client = SmallLLMClient()
        self.large_client = LargeLLMClient()
        self.COMPLEXITY_THRESHOLD = 0.6

    async def route_and_process(self, request: RouteRequest) -> LLMResponse:
        start_time = time.time()
        
        # 1. Determine Complexity
        score = self.classifier.analyze(request.prompt)
        
        # 2. Decide Tier
        if request.model_override:
            tier = request.model_override
            reason = f"User override to {tier.value}"
        elif score >= self.COMPLEXITY_THRESHOLD:
            tier = ModelTier.LARGE
            reason = f"High complexity score ({score:.2f} >= {self.COMPLEXITY_THRESHOLD})"
        else:
            tier = ModelTier.SMALL
            reason = f"Low complexity score ({score:.2f} < {self.COMPLEXITY_THRESHOLD})"
            
        # 3. Dispatch to Client
        if tier == ModelTier.LARGE:
            content = await self.large_client.generate_response(request.prompt)
        else:
            content = await self.small_client.generate_response(request.prompt)
            
        duration = (time.time() - start_time) * 1000
        
        return LLMResponse(
            content=content,
            metadata=RouteMetadata(
                complexity_score=score,
                selected_tier=tier,
                routing_reason=reason,
                processing_time_ms=round(duration, 2)
            )
        )
