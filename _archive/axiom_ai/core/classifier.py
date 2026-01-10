import re
from typing import List

class ComplexityClassifier:
    """
    Analyzes prompt complexity using heuristic signals.
    Returns a score between 0.0 (Simple) and 1.0 (Complex).
    """
    
    COMPLEX_KEYWORDS = {
        'code', 'function', 'class', 'algorithm', 'debug', 'optimize',
        'explain', 'architecture', 'database', 'system design', 'analysis',
        'compare', 'contrast', 'evaluate', 'physics', 'math', 'calculus',
        'rust', 'cpp', 'python', 'java', 'pointer', 'memory'
    }
    
    CODE_INDICATORS = [
        r'def\s+\w+',          # Python function
        r'class\s+\w+',        # Class definition
        r'impl\s+\w+',         # Rust impl
        r'fn\s+\w+',           # Rust/Go function
        r'public\s+void',      # Java/C#
        r'import\s+\w+',       # Imports
        r'\{.*\}',             # Braces (broad catch)
        r'```',                # Markdown code blocks
    ]

    def analyze(self, prompt: str) -> float:
        score = 0.0
        lower_prompt = prompt.lower()
        
        # Factor 1: Length (Longer prompts often require more context/reasoning)
        # Cap length contribution at 0.3
        length = len(prompt)
        score += min(length / 1000, 0.3)
        
        # Factor 2: Domain Keywords (0.05 per keyword, capped at 0.4)
        found_keywords = sum(1 for kw in self.COMPLEX_KEYWORDS if kw in lower_prompt)
        score += min(found_keywords * 0.05, 0.4)
        
        # Factor 3: Code Structure (0.15 per match, capped at 0.3)
        code_matches = sum(1 for pattern in self.CODE_INDICATORS if re.search(pattern, prompt))
        score += min(code_matches * 0.15, 0.3)
        
        return min(score, 1.0)
