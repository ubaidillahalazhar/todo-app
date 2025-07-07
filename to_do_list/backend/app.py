from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

TASKS_FILE = 'frontend/tasks.json'

def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return {"daily": [], "weekly": []}
    with open(TASKS_FILE, 'r') as file:
        return json.load(file)

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as file:
        json.dump(tasks, file, indent=4)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(load_tasks())

@app.route('/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    tasks = load_tasks()
    category = task_data.get('category', 'daily')
    tasks[category].append(task_data['task'])
    save_tasks(tasks)
    return jsonify({'message': 'Task added successfully'})

@app.route('/tasks/<category>/<int:index>', methods=['DELETE'])
def delete_task(category, index):
    tasks = load_tasks()
    if category in tasks and 0 <= index < len(tasks[category]):
        tasks[category].pop(index)
        save_tasks(tasks)
        return jsonify({'message': 'Task deleted'})
    return jsonify({'error': 'Invalid index or category'}), 400

@app.route('/tasks/<category>/<int:index>', methods=['PUT'])
def edit_task(category, index):
    tasks = load_tasks()
    new_task = request.json.get('task')
    if category in tasks and 0 <= index < len(tasks[category]):
        tasks[category][index] = new_task
        save_tasks(tasks)
        return jsonify({'message': 'Task updated'})
    return jsonify({'error': 'Invalid index or category'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

