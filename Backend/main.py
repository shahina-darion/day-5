from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rapidfuzz import process

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow cross-origin requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity (use specific URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Predefined keywords for auto-completion
darion_keywords = ["let", "print", "function", "for each", "if", "else", "return", "import", "while", "do"]

# Sample syntax corrections
syntax_corrections = {
    "funtion": "function",
    "prnt": "print",
    "retun": "return",
    "fr each": "for each",
    "wihle": "while"
}

# Define the request body model for code submission
class CodeRequest(BaseModel):
    code: str

# Autocomplete endpoint
@app.post("/autocomplete/")
async def autocomplete(request: CodeRequest):
    """Returns suggested words for auto-completion."""
    input_text = request.code.split()[-1]  # Last word typed by user
    suggestions = process.extract(input_text, darion_keywords, limit=3)
    return {"suggestions": [s[0] for s in suggestions]}

# Code correction endpoint
@app.post("/correct/")
async def correct_code(request: CodeRequest):
    """Returns corrected syntax if any mistakes are found."""   
    words = request.code.split()
    corrected_words = [syntax_corrections.get(word, word) for word in words]
    return {"corrected_code": " ".join(corrected_words)}

# Run the FastAPI app (only for local development)
if __name__== "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
