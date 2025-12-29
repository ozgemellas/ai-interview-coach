from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from services import LLMService, TTSService

app = FastAPI(title="AI HR Interviewer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
# Note: The model specific logic is encapsulated in LLMService (using local GGUF)
llm_service = LLMService() 
tts_service = TTSService()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model_name: Optional[str] = "local-model"

class ChatResponse(BaseModel):
    text: str
    audio_base64: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Receives chat history, gets response from LLM, converts to Audio, returns both.
    """
    # 1. Update model name if provided - SKIPPED (Service uses fixed local model)
    # llm_service.model_name = request.model_name
    
    # 2. Get Text Response from Ollama
    ai_text = await llm_service.get_response([msg.dict() for msg in request.messages])
    
    # 3. Convert Text to Audio
    # You might want to strip code blocks or special chars for better TTS?
    # For now, we pass raw text.
    audio_b64 = await tts_service.generate_audio(ai_text)
    
    return ChatResponse(
        text=ai_text,
        audio_base64=audio_b64
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
