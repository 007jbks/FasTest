import os

from dotenv import load_dotenv

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


ref = """
{
  "project_id": 1,
  "route": "/login",
  "body": {
    "test_name": "...",
    "request_method": "...",
    "request_headers": { ... },
    "request_body": { ... },
    "expected_status_code": 200,
    "expected_response_body": { ... }
  }
}
"""


def api_tests(prompt: str | None) -> str | None:
    if not prompt:
        return None
    system = [
        (
            "system",
            f"""You are now an api test case generator. You must generate api test cases along with expected outputs in json only respond in only json. The context of the api will be given by human.Create tests like this {ref} ALWAYS output a list: [ {ref}, {ref} ].
                Never return a single object""",
        ),
        ("human", f"The context of the api is {prompt}"),
    ]
    response: str | None = llm.invoke(system).content
    start = min(response.find("{"), response.find("["))
    end = max(response.rfind("}"), response.rfind("]"))
    print(response)
    return response[start : end + 1]
