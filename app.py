from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

class TodoSchema(ma.Schema):
    class Meta:
        fields = ('id', 'content', 'completed')

todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

@app.route('/todos', methods=['GET'])
def get_todos():
    all_todos = Todo.query.all()
    result = todos_schema.dump(all_todos)
    return jsonify(result)

@app.route('/todos', methods=['POST'])
def add_todo():
    content = request.json['content']
    new_todo = Todo(content=content)
    db.session.add(new_todo)
    db.session.commit()
    return todo_schema.jsonify(new_todo)

@app.route('/todos/<int:id>', methods=['GET'])
def get_todo(id):
    todo = Todo.query.get(id)
    return todo_schema.jsonify(todo)

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    todo = Todo.query.get(id)
    content = request.json['content']
    completed = request.json['completed']
    todo.content = content
    todo.completed = completed
    db.session.commit()
    return todo_schema.jsonify(todo)

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get(id)
    db.session.delete(todo)
    db.session.commit()
    return todo_schema.jsonify(todo)

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/base.html')
def base():
    return render_template('base.html')

@app.route('/todo.html')
def todos():
    return render_template('todo.html')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)