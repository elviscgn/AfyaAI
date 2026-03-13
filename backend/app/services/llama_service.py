from app.core.config import settings
from app.services.translation_service import TranslationService, SA_LANG_CODES
from google import genai
from google.genai import types 
import requests
from typing import Optional

class LlamaClient:

    def __init__(self):
        self.client = None 
        self.client_type = None
        self.api_url = None
        self.model_name = None
        
        self.translator = TranslationService()
        self.lang_codes = SA_LANG_CODES
        
        if settings.FEATHERLESS_API_KEY != "dummy_featherless_key":
            self.client_type = "LLAMA"
            self.api_url = settings.FEATHERLESS_API_URL
            self.model_name = settings.LLAMA_CHAT_MODEL_FEATHERLESS
            self.client = requests.Session() 

        elif settings.GEMINI_API_KEY != "dummy_gemini_key":
            self.client_type = "GEMINI"
            self.api_url = None  
            self.model_name = settings.GEMINI_CHAT_MODEL
            self.client = genai.Client()
        
        else:
            raise ValueError(
                "CRITICAL: No valid API key found. Please check your .env file for FEATHERLESS or GEMINI_API_KEY."
            )
            
        print(f"LlamaClient initialized successfully. Using {self.client_type} API.")

    def generate_content(self, system_prompt: str, user_input: str, source_lang: str = 'en', target_lang: str = 'en') -> str:
        
        english_input = self.translator.translate_to_english(user_input, source_lang)
        
        english_response = ""
        
        try:
            if self.client_type == "GEMINI":
                config = types.GenerateContentConfig(system_instruction=system_prompt)
                
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=english_input,  
                    config=config,
                )
                english_response = response.text.strip()
                
            elif self.client_type == "LLAMA":
                headers = {
                    "Authorization": f"Bearer {settings.FEATHERLESS_API_KEY}",
                    "Content-Type": "application/json",
                }
                
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": english_input} 
                    ],
                    "temperature": 0.5, 
                    "max_tokens": 1024,
                }
                
                # FIX 2: Pointing directly to the chat completions endpoint
                endpoint = f"{self.api_url.rstrip('/')}/chat/completions"
                response = self.client.post(endpoint, headers=headers, json=payload)
                response.raise_for_status() 
                
                english_response = response.json()['choices'][0]['message']['content'].strip()
                
            else:
                return "Internal Error: Client Type not recognized. [SEVERITY: LOW]"
                
            # 1. Default to LOW if the AI failed to generate a tag
            severity_tag = "[SEVERITY: LOW]"
            clean_english_text = english_response

            # 2. Extract the exact English tag before translation
            if "[SEVERITY:" in english_response:
                parts = english_response.split("[SEVERITY:")
                clean_english_text = parts[0].strip()
                
                # Safely extract just the severity level (LOW, MEDIUM, HIGH)
                severity_level = parts[1].strip().replace("]", "")
                severity_tag = f"[SEVERITY: {severity_level}]"

            # 3. Translate ONLY the conversational text
            translated_text = self.translator.translate_from_english(clean_english_text, target_lang)
            
            # 4. Reattach the untranslated English tag to the very end
            final_response = f"{translated_text} {severity_tag}"
            
            return final_response

        except requests.exceptions.HTTPError as e:
            print(f"LLAMA API Error (HTTP Status): {e}")
            return "I apologize, the AI connection failed. Please ensure your API key is correct and try again. [SEVERITY: LOW]"
        except Exception as e:
            print(f"LLM API Error during processing: {e}")
            return "I apologize, but I am having trouble connecting to my central brain. Please try again later. [SEVERITY: LOW]"