import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from langchain.document_loaders.unstructured import UnstructuredFileLoader 
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import VectorDBQA
from langchain.chat_models import ChatOpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set your OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# Load the document and create Langchain components
loader = UnstructuredFileLoader('document.txt')
documents = loader.load()

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()

# Create a vector database and use it to index the embeddings
db = Chroma.from_documents(texts, embeddings)

# Initialize Langchain for question answering
qa = VectorDBQA.from_chain_type(llm=ChatOpenAI(), chain_type="stuff", vectorstore=db, k=1)

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
    question_answer_pairs = [
        {
            "question": "KC's Tie-up in Top 500 Universities We Put Partners First!",
            "answer_items": [
                "McGill University (School of Continuing Education)",
                "University of Waterloo",
                "University of Calgary (School of Continuing Education)",
                "Queen's University at Kingston",
                "Dalhousie University",
                "University of Victoria",
                "York University"
            ]
        },
        # Add more question-answer pairs as needed
    ]
    user_input_lower = user_input.lower()
    
    if user_input_lower == "exit":
        return jsonify({"assistant_response": "Goodbye!"})
    
    # Check if the user's input is in the question-answer pairs
    for pair in question_answer_pairs:
        if user_input_lower == pair["question"].lower():
            answer_items = pair["answer_items"]
            answer = "\n".join(answer_items)
            return jsonify({"assistant_response": answer})

    # If no match is found in the question-answer pairs, use Langchain for question-answering
    answer = qa.run(user_input)
    
    if answer:
        return jsonify({"assistant_response": answer})
    
    # If Langchain doesn't have an answer, use ChatGPT
    assistant_response = chat_with_gpt3(user_input)
    return jsonify({"assistant_response": assistant_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
