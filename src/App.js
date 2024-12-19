import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const generateId = () => Math.floor(Math.random() * 10000);

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");

  // Récupérer les objets depuis le backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => console.error("Erreur lors de la récupération des objets", error));
  }, []);

  const addItem = () => {
    if (!name || !email) return;

    axios.post("http://localhost:5000/api/items", { name, email })
      .then(response => {
        setItems([...items, response.data]);
        setName("");
        setEmail("");
      })
      .catch(error => console.error("Erreur lors de l'ajout de l'objet", error));
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error("Erreur lors de la suppression de l'objet", error));
  };

  const startEditing = (id) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setEditingId(id);
      setEditingName(item.name);
      setEditingEmail(item.email);
    }
  };

  const saveEdit = () => {
    axios.put(`http://localhost:5000/api/items/${editingId}`, { name: editingName, email: editingEmail })
      .then(response => {
        setItems(items.map(item =>
          item.id === editingId ? { ...item, name: editingName, email: editingEmail } : item
        ));
        setEditingId(null);
        setEditingName("");
        setEditingEmail("");
      })
      .catch(error => console.error("Erreur lors de la modification de l'objet", error));
  };

  return (
    <div className="App">
      <h1>Gestion des objets</h1>
      <div>
        <input
          type="text"
          value={name}
          placeholder="Nom"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addItem}>Ajouter</button>
      </div>

      {editingId && (
        <div>
          <h2>Modifier l'objet</h2>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
          <input
            type="email"
            value={editingEmail}
            onChange={(e) => setEditingEmail(e.target.value)}
          />
          <button onClick={saveEdit}>Sauvegarder</button>
        </div>
      )}

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name} - {item.email}</span>
            <button onClick={() => startEditing(item.id)}>Modifier</button>
            <button onClick={() => deleteItem(item.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
