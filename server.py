from flask import Flask, jsonify, request
import git
import os
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
openai.api_key = 'OPEN AI API KEY'

def read_files_with_extension(directory, extension):
    file_contents = []
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith(extension):
                file_path = os.path.join(directory, filename)
                with open(file_path, 'r') as file:
                    file_contents.append(file.read())
    return file_contents

def fetch_code_from_repository(repo_url, branch='main'):
    try:
        repo = git.Repo.clone_from(repo_url, "temp_repo")
        repo.git.checkout(branch)
        java_files = repo.git.ls_files("**/*.java").splitlines()
        java_code = read_files_with_extension('./temp_repo', '.java')
        return java_code
    except git.exc.GitCommandError as e:
        error_message = str(e)
        return jsonify(message=f"Error while fetching Java code from the repository: {error_message}"), 500
    except Exception as e:
        error_message = str(e)
        return jsonify(message=f"An error occurred: {error_message}"), 500

def generate_feedback(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["###"]
    )
    generated_text = response.choices[0].text.strip()
    return generated_text

@app.route("/feedback", methods=['POST'])
def get_feedback():
    if request.method == 'POST':
        data = request.json
        repository_url = data.get('url')

        if not repository_url:
            return jsonify(message='Please provide a GitHub repository URL'), 400

        java_code = fetch_code_from_repository(repository_url)

        if not java_code:
            return jsonify(message='Error while fetching Java code from the repository'), 500

        feedback_list = []

        for i, code in enumerate(java_code):
            prompt = f"""######
        Please provide a code review to improve provided java code based on the provided guidelines:\n###
        
        Guidelines for Java code reviews:\n###
        1.Please provide feedback on the code's adherence to Java conventions.\n### 
        
        2.Replace imperative code with lambdas and streams: Identify any loops or verbose methods in the code and suggest replacing them with streams and lambdas for improved readability and functional programming. Provide examples of how to rewrite the code using streams and lambdas.\n###
        
        3.Please make sure to avoid returning nulls if possible and handle potential null values appropriately, such as using null checks or utilizing the Optional class. Additionally, consider using annotations like @Nullable or @NonNull to catch null conflicts during code compilation.\n###
        
        4.Please make sure that references exposed to the client code are not manipulated, even if the field is declared as final. Instead, consider cloning the reference or creating a new reference before assigning it to the field. Similarly, when returning references, avoid exposing internal mutable state.\n###
        
        5.Handle exceptions with care: Analyze the exception handling in the code and ensure that catch blocks are ordered from most specific to least specific. Consider the use of checked exceptions for recoverable scenarios and handle exceptions appropriately.\n###
        
        6.Please ensure that the appropriate data structure is chosen based on the specific requirements and characteristics of the data. Consider the pros and cons of different Java collections, such as Map, List, and Set.\n###
        
        7.Review the access modifiers in the code and recommend keeping methods or variables private by default unless they need to be exposed to client code. Discuss the potential consequences of exposing certain methods or variables.\n###
        
        8. Ensure interfaces are used instead of concrete implementations to allow for future flexibility and easier code maintenance.\n###
        
        9. Assess the necessity and generic nature of interfaces used in the code. Recommend avoiding unnecessary interfaces that may require maintenance in the future. Explain when interfaces are beneficial and provide appropriate use cases.\n###
        
        10. Override hashCode when overriding equals: Verify if the equals method is correctly overridden whenever necessary, especially for value objects. Emphasize the importance of overriding both equals and hashCode methods to ensure consistency and proper functionality.\n###
        
        review the provided java code based on provided guidelines and share detailed feedback (Highlighting the violations of guidelines) .if any of the guidelines are not correctly implemented in the any of the java code highlight the issues and tell about the improvements in the ocde through sample code examples and enhancements. If the provided code correctly implements every guidelines, respond with "Everything is fine!".\n###
            Code for Java file {i + 1}:
            {code}
            """

            feedback = generate_feedback(prompt)
            feedback_list.append(feedback)

        feedback_dict = {f"Java File {i + 1}": feedback for i, feedback in enumerate(feedback_list)}
        response_headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        return jsonify(feedback_dict), 200, response_headers
        
    else:
        return jsonify(message='Method not allowed'), 405

if __name__ == "__main__":
    app.run(debug=True)
