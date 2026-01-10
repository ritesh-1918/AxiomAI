import asyncio
import sys
from axiom_ai.core.models import RouteRequest
from axiom_ai.core.router import LLMRouter
from rich.console import Console
from rich.table import Table

console = Console()

async def run_demo():
    router = LLMRouter()
    
    test_cases = [
        "Hi, how are you?", 
        "What is the capital of France?",
        "Write a 5 line poem about a cat.",
        "Explain the difference between a mutex and a semaphore in Rust, including a code example showing arc<mutex>.",
        "Solve this differential equation: dy/dx = y + x.",
        "Write a detailed system design for a distributed key-value store like DynamoDB."
    ]

    table = Table(title="AxiomAI Routing Demo")
    table.add_column("Prompt", style="cyan", no_wrap=False, width=40)
    table.add_column("Score", style="magenta")
    table.add_column("Tier", style="green")
    table.add_column("Reason", style="yellow")

    console.print("[bold blue]Running AxiomAI Routing Tests...[/bold blue]\n")

    for prompt in test_cases:
        req = RouteRequest(prompt=prompt)
        response = await router.route_and_process(req)
        
        table.add_row(
            prompt, 
            str(round(response.metadata.complexity_score, 2)), 
            response.metadata.selected_tier.value,
            response.metadata.routing_reason
        )

    console.print(table)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_demo())
