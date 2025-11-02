from flask import Flask, render_template, request, jsonify
import json
import os
import uuid

app = Flask(__name__)
DATA_FILE = "tasks.json"

def load_tasks():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as j:
            try:
                return json.load(j)
            except json.JSONDecodeError:
                return []
    return []

def save_tasks(tasks):
    with open(DATA_FILE, "w") as j:
        json.dump(tasks, j, indent=2)
        print(f"{len(tasks)} task(s) in total")

@app.route("/")
def index():
    return render_template("index.html", tasks=load_tasks())

@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    tasks = load_tasks()
    new_task = {
        "id": str(uuid.uuid4()),
        "text": data["text"],
        "done": False
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task)

@app.route("/toggle/<task_id>", methods=["POST"])
def toggle_task(task_id):
    tasks = load_tasks()
    for t in tasks:
        if t["id"] == task_id:
            t["done"] = not t["done"]
            break
    save_tasks(tasks)
    return jsonify(success=True)

@app.route("/delete/<task_id>", methods=["POST"])
def delete_task(task_id):
    tasks = [t for t in load_tasks() if t["id"] != task_id]
    save_tasks(tasks)
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(debug=True)
