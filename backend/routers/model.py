import os
from dotenv import load_dotenv

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


ref = """
{
    "base_url":"127.0.0.1",
    "route" : "/login",
    "test_name": "Successful Login with Valid Credentials",
    "request_method": "POST",
    "request_headers": {
      "Content-Type": "application/json"
    },
    "request_body": {
      "email": "user@example.com",
      "password": "SecurePassword123"
    },
    "expected_status_code": 200,
    "expected_response_body": {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImlhdCI6MTY3ODkwMTIzNH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
  }
"""


def api_tests(prompt: str | None) -> str | None:
    if not prompt:
        return None
    system = [
        (
            "system",
            f"You are now an api test case generator. You must generate api test cases along with expected outputs in json only respond in only json. The context of the api will be given by human.Create tests like this {ref}",
        ),
        ("human", f"The context of the api is {prompt}"),
    ]
    response: str | None = llm.invoke(system).content
    start = min(response.find("{"), response.find("["))
    end = max(response.rfind("}"), response.rfind("]"))
    return response[start : end + 1]
