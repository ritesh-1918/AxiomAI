import gradio as gr
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re

# Load model from HuggingFace Hub
MODEL_ID = "ritesh1918/axiom-llm-router"
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)
    model.eval()
    MODEL_LOADED = True
except:
    MODEL_LOADED = False

def analyze_complexity(text):
    """Rule-based complexity analysis"""
    score = 0
    text_lower = text.lower()
    
    # === SIMPLE TASK PATTERNS (strong negative indicators) ===
    simple_task_patterns = [
        'rewrite', 'rephrase', 'simplify', 'summarize', 'translate',
        'correct the grammar', 'fix the spelling', 'make it simpler',
        'in simpler', 'easy to read', 'for a child', 'for students',
        'shorter version', 'brief summary', 'paraphrase'
    ]
    for pattern in simple_task_patterns:
        if pattern in text_lower:
            score -= 5  # Strong signal this is a simple task
    
    # Simple greetings/questions
    simple_patterns = [
        'hello', 'hi ', 'hey', 'how are you', 'what is', 'who is', 
        'thanks', 'thank you', 'yes', 'no', 'ok', 'okay', 'bye',
        'good morning', 'good night', 'what time', 'weather',
        'define ', 'what does', 'meaning of'
    ]
    for pattern in simple_patterns:
        if pattern in text_lower:
            score -= 3
    
    # === COMPLEX TASK PATTERNS (positive indicators) ===
    # Code/Algorithm requests
    code_keywords = [
        'write code', 'implement', 'debug', 'algorithm', 'function',
        'program', 'script', 'api', 'database', 'sql query',
        'recursive', 'optimize', 'refactor', 'data structure'
    ]
    for kw in code_keywords:
        if kw in text_lower:
            score += 4
    
    # Deep analysis requests
    analysis_keywords = [
        'analyze in detail', 'comprehensive analysis', 'evaluate',
        'compare and contrast', 'critical analysis', 'pros and cons',
        'step by step solution', 'mathematical proof', 'derive the',
        'calculate the', 'solve the equation'
    ]
    for kw in analysis_keywords:
        if kw in text_lower:
            score += 3
    
    # Creative/Complex writing
    complex_writing = [
        'write an essay', 'research paper', 'technical report',
        'business plan', 'legal document', 'thesis'
    ]
    for kw in complex_writing:
        if kw in text_lower:
            score += 3
    
    # Length factor (but less weight than before)
    if len(text) > 500:
        score += 1
    
    # Short prompts with no complex indicators = simple
    if len(text) < 50 and score <= 0:
        score -= 2
    
    return score

def classify_prompt(prompt):
    """Classify a prompt as needing Small or Large LLM"""
    
    # Get complexity score from rules
    complexity_score = analyze_complexity(prompt)
    
    # Try ML model if loaded
    ml_prediction = None
    ml_confidence = 0.5
    
    if MODEL_LOADED:
        try:
            inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=128, padding=True)
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1)
                ml_prediction = torch.argmax(probs, dim=1).item()
                ml_confidence = probs[0][ml_prediction].item()
        except:
            pass
    
    # Decision logic - rules have priority for clear cases
    if complexity_score <= -3:
        # Clear simple task
        prediction = 0
        confidence = min(0.96, 0.85 + abs(complexity_score) * 0.02)
        method = "Rule-based (simple task detected)"
    elif complexity_score >= 3:
        # Clear complex task
        prediction = 1
        confidence = min(0.98, 0.80 + complexity_score * 0.03)
        method = "Rule-based (complex task detected)"
    elif ml_prediction is not None:
        # Edge cases - use ML
        prediction = ml_prediction
        confidence = ml_confidence
        method = "ML Model"
    else:
        # Fallback
        prediction = 1 if complexity_score > 0 else 0
        confidence = 0.70 + abs(complexity_score) * 0.05
        method = "Heuristic"
    
    tier = "🔥 LARGE LLM" if prediction == 1 else "⚡ SMALL LLM"
    
    if prediction == 1:
        explanation = "Complex task - requires advanced reasoning"
    else:
        explanation = "Simple task - fast model is sufficient"
    
    return {
        "Recommended Tier": tier,
        "Confidence": f"{confidence*100:.1f}%",
        "Explanation": explanation,
        "Complexity Score": round(complexity_score, 1),
        "Method": method
    }

# Gradio Interface
demo = gr.Interface(
    fn=classify_prompt,
    inputs=gr.Textbox(label="Enter your prompt", placeholder="e.g., Rewrite this in simpler words...", lines=4),
    outputs=gr.JSON(label="Routing Decision"),
    title="🧠 AxiomAI - Intelligent LLM Router",
    description="Enter a prompt to see which LLM tier should handle it. Uses hybrid ML + rule-based classification.",
    examples=[
        ["Hello, how are you?"],
        ["What is 2+2?"],
        ["Rewrite the following paragraph in simpler English: Artificial intelligence is transforming industries."],
        ["Summarize this article in 3 sentences."],
        ["Write a recursive algorithm to solve Tower of Hanoi with memoization"],
        ["Explain the mathematical foundations of transformer attention mechanisms"],
        ["Implement a binary search tree with insert, delete, and search operations in Python"],
    ]
)

if __name__ == "__main__":
    demo.launch()
