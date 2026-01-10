from fastapi import FastAPI
from .core.models import RouteRequest, LLMResponse
from .core.router import LLMRouter

app = FastAPI(title="AxiomAI", description="Intelligent LLM Routing Layer")
router = LLMRouter()

@app.post("/v1/chat/completions", response_model=LLMResponse)
async def chat_completions(request: RouteRequest):
    """
    OpenAI-compatible-ish endpoint that routes requests to the appropriate model.
    """
    return await router.route_and_process(request)

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "AxiomAI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
