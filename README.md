# FasTest
AI API Tester written in FastAPI and next.js

## Stuff added till now:
1. Landing page
2. Signup
3. Login
4. Dashboard
5. Main Tool Page
6. Generated Results Page
7. Repository page with three tabs - url, routes and tests


## Backend Features

### Authentication
-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Log in an existing user.

### API Test Generation
-   `POST /api/generate-tests`: Generate API tests from a prompt.
-   `POST /api/save-tests`: Save generated API tests.

### Test History
-   `GET /history/url`: Get all unique URLs for which the user has created tests.
-   `POST /history/tests`: Get all tests for a specific URL.
-   `PUT /history/test/{test_id}`: Edit an existing test case.

### Dashboard
-   `GET /dashboard/`: Get statistics about the user's testing activity, including:
    -   Total number of tests.
    -   Total number of unique URLs tested.
    -   Total number of unique routes tested.
    -   Number of tests created in the last week, broken down by day.
    -   Total number of "positive" test cases (placeholder logic).
