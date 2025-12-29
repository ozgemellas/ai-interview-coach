import httpx
import edge_tts
import uuid
import os
import base64
from io import BytesIO

OLLAMA_API_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "gemma:2b" # Default fallback, should be configured or passed

# import httpx  # No longer needed for LLM, but maybe keep if you want to switch back later
from llama_cpp import Llama

# Defines path to the local model
# Going up one level from 'backend' to root to find the model file
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "llama-3-8b-instruct.Q4_K_M.gguf")

class LLMService:
    def __init__(self):
        # Initialize the local GGUF model
        # n_ctx=2048 or 4096 depending on your needs
        # n_gpu_layers=-1 tries to offload all to GPU if supported/installed
        print(f"Loading local model from: {MODEL_PATH}")
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
            
        self.llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=4096,          # Window size
            n_gpu_layers=-1,     # Use generic GPU offloading if available
            verbose=True
        )

    async def get_response(self, messages: list) -> str:
        """
        Generates a response using the local llama-cpp-python model.
        """
        try:
            # Llama-cpp-python supports OpenAI-like chat completion API
            response = self.llm.create_chat_completion(
                messages=messages,
                max_tokens=512,  # Limit response length
                temperature=0.7,
                stream=False
            )
            
            # Extract content from response
            return response["choices"][0]["message"]["content"]

        except Exception as e:
            print(f"Error generating response: {e}")
            return "Üzgünüm, şu an cevap üretirken bir sorun yaşadım."

class TTSService:
    @staticmethod
    async def generate_audio(text: str, voice: str = "en-US-AriaNeural") -> str:
        """
        Generates TTS audio using edge-tts and returns it as a Base64 string.
        """
        communicate = edge_tts.Communicate(text, voice)
        
        # We want to capture the audio in memory
        # edge-tts async generator yields bytes
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        
        # Convert to base64
        audio_base64 = base64.b64encode(audio_data).decode("utf-8")
        return audio_base64
