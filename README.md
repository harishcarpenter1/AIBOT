# AI JAVA Code Review Bot

The Code Review Bot is a full-stack application developed using ReactJS and Python. It fetches code from a GitHub repository provided by the user and analyzes it based on predefined guidelines for Java code reviews. The bot leverages OpenAI's "GPT 3.5 Turbo" language model to provide human-like text responses and suggestions for code improvements.

## Features

- **Frontend Technologies**: The frontend of the application is built using ReactJS, HTML, and CSS. React hooks such as useState and useEffect are used to manage state, handle user input, and perform side effects. The user interface (UI) is defined using JSX, allowing dynamic rendering of messages and input forms.

- **Backend Technologies**: The backend of the application is developed using Python with the Flask web framework. Flask is a lightweight web framework that enables seamless communication with the frontend. The Flask app is initialized, and Cross-Origin Resource Sharing (CORS) is enabled to allow communication with the frontend.

- **Code Retrieval and Processing**: The bot includes functions to fetch code from a Git repository provided by the user. The Git library is used to clone the repository, checkout a specific branch, and retrieve Java code files. The fetched Java code files are then read and stored for further processing.

- **OpenAI Integration**: To generate feedback, the bot utilizes OpenAI's "GPT 3.5 Turbo" language model. A function called "generate_feedback" is defined, which sends a prompt to the OpenAI Completion API. The generated feedback is obtained from the API response and returned.

- **API Endpoint and Response**: The Flask route "/feedback" handles POST requests from the frontend. The function "get_feedback" is executed when the route is accessed. It retrieves the repository URL from the request data and fetches Java code from the repository. For each Java code file, it generates feedback using the "generate_feedback" function. The feedback is stored in a dictionary and returned as a JSON response to the frontend.

## Usage

To use the Code Review Bot, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install` for the frontend and `pip install -r requirements.txt` for the backend.
3. Start the Flask backend server by running `python server.py`.
4. Start the React development server by running `npm start`.
5. Access the application in your browser at `http://localhost:3000`.
6. Enter the URL of the GitHub repository you want to analyze.
7. Click the "Submit" button to initiate the code review process.
8. The bot will analyze the code based on predefined guidelines and provide feedback and suggestions for improvements.
9. Review the feedback and use it to enhance your code quality.

## Future Improvements

- Extend the bot's functionality to support code reviews for languages other than Java.
- Implement additional code analysis rules and guidelines to provide more comprehensive feedback.

## Sample Demo Image
![Screenshot (205)](https://github.com/harishcarpenter1/AIBOT/assets/92323049/bb959e6b-9d3e-4d8a-8097-fb2374c603d1)

![Screenshot (206)](https://github.com/harishcarpenter1/AIBOT/assets/92323049/9e228e54-c347-49c6-8e46-6ba9fd960b0d)

![Screenshot (207)](https://github.com/harishcarpenter1/AIBOT/assets/92323049/6e7cc989-816f-4bf4-8c15-76c439befe04)




