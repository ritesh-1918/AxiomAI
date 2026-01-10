import asyncio
import random

class BaseLLMClient:
    async def generate_response(self, prompt: str) -> str:
        raise NotImplementedError

class SmallLLMClient(BaseLLMClient):
    """
    Simulates a small, fast model (e.g., Llama-3-8B, GPT-3.5-Turbo).
    """
    async def generate_response(self, prompt: str) -> str:
        # Simulate fast latency
        await asyncio.sleep(0.5) 
        return f"[Small Model] I can give you a quick answer. processed: '{prompt[:50]}...'"

class LargeLLMClient(BaseLLMClient):
    """
    Simulates a large, reasoning model (e.g., GPT-4, Claude 3 Opus).
    """
    async def generate_response(self, prompt: str) -> str:
        # Simulate slower reasoning latency
        await asyncio.sleep(2.0)
        return f"[Large Model] I have analyzed this deeply. Here is a detailed response for: '{prompt[:50]}...'"
