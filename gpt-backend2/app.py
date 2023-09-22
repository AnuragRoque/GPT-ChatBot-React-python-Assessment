import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
# openai.api_key = os.environ.get('openai_API_KEY')
# openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set your OpenAI API key
#  = openai_api_key

def chat_with_gpt3(user_input):
    messages = [{"role": "user", "content": user_input}]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    assistant_response = response["choices"][0]["message"]["content"]
    return assistant_response

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("user_input", "")

    if user_input.lower() == "exit":
        return jsonify({"assistant_response": "Goodbye!"})

    assistant_response = chat_with_gpt3(user_input)
    return jsonify({"assistant_response": assistant_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
