import { useState, useEffect } from "react";
import "./App.css"; // dodajemo za stilove

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Greška pri učitavanju:", err));
  }, []);

  const addTodo = () => {
    if (!text.trim()) return;
    fetch("http://localhost:5001/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(newTodo => setTodos(prev => [...prev, newTodo]))
      .catch(err => console.error("Greška pri dodavanju:", err));
    setText("");
  };

  const toggleDone = (id, done) => {
    fetch(`http://localhost:5001/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: done ? 0 : 1 }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri update-u");
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, done: done ? 0 : 1 } : todo
          )
        );
      })
      .catch(err => console.error(err));
  };

  const deleteTodo = id => {
    fetch(`http://localhost:5001/todos/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri brisanju");
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">To-Do Lista</h1>

      <div className="input-group">
        <input
          className="todo-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Unesi novi zadatak..."
        />
        <button className="add-btn" onClick={addTodo}>
          Dodaj
        </button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`todo-item ${todo.done ? "done" : ""}`}
          >
            <span
              className="todo-text"
              onClick={() => toggleDone(todo.id, todo.done)}
            >
              {todo.text}
            </span>
            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
