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


def api_tests(prompt: str | None) -> str | None:
    if not prompt:
        return None
    system = [
        (
            "system",
            "You are now an api test case generator. You must generate api test cases along with expected outputs in json only respond in only json. The context of the api will be given by human.",
        ),
        ("human", f"The context of the api is {prompt}"),
    ]
    response: str | None = llm.invoke(system).content
    return response[7:-3]


print(
    api_tests(
        "The api is of authentication basic login route the url is 127.0.0.1 and the route is your basic /login route "
    )
)
