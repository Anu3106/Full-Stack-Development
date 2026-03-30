const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let users = [];

// 🔐 Register
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Please enter all fields");
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.send("User already exists");
    }

    users.push({ username, password, notes: [] });
    res.send("Registered successfully");
});

// 🔐 Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.send("Invalid credentials");
    }

    res.json({ username: user.username });
});

// ➕ Add Note
app.post("/addNote", (req, res) => {
    const { username, text } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.send("User not found");

    user.notes.push(text);
    res.send("Note added");
});

// 📥 Get Notes
app.get("/notes/:username", (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return res.json([]);

    res.json(user.notes);
});

// ❌ Delete Note
app.delete("/deleteNote", (req, res) => {
    const { username, index } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.send("User not found");

    user.notes.splice(index, 1);
    res.send("Deleted");
});

// Add this at the end of server.js
app.listen(3000, () => console.log("Server running on port 3000"));