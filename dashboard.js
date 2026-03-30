const username = localStorage.getItem("user");

let currentIndex = null;

// 🚪 Logout
function logout() {
    localStorage.removeItem("user");
    window.location = "/";
}

// 📥 Load Notes
async function loadNotes() {
    const res = await fetch(`/notes/${username}`);
    const notes = await res.json();

    const container = document.getElementById("notes");
    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; opacity:0.6; margin-top:40px;">
                <p>🌙 It's quiet here...</p>
                <p>Write your first thought ✨</p>
            </div>
        `;
        return;
    }

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note";

        const title = note.substring(0, 15) + "...";

        div.innerHTML = `
            <p class="note-title">${title}</p>
            <button onclick="deleteNote(${index}); event.stopPropagation();">Delete</button>
        `;

        div.onclick = () => openModal(note, index);

        container.appendChild(div);
    });
}

// 🌙 OPEN MODAL
function openModal(note, index) {
    currentIndex = index;
    document.getElementById("modalText").value = note;
    document.getElementById("modal").style.display = "block";
}

// ❌ CLOSE
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 👆 CLICK OUTSIDE CLOSE
function outsideClick(e) {
    if (e.target.id === "modal") {
        closeModal();
    }
}

// 💾 SAVE EDIT
async function saveEdit() {
    const updatedText = document.getElementById("modalText").value;

    await fetch("/deleteNote", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, index: currentIndex })
    });

    await fetch("/addNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text: updatedText })
    });

    closeModal();
    loadNotes();
}

// ➕ Add
async function addNote() {
    const input = document.getElementById("noteInput");

    if (!input.value) return;

    await fetch("/addNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text: input.value })
    });

    input.value = "";
    loadNotes();
}

// ❌ Delete
async function deleteNote(index) {
    await fetch("/deleteNote", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, index })
    });

    loadNotes();
}

loadNotes();