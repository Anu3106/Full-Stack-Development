async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter username and password 😤");
        return;
    }

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => null);

    if (data && data.username) {
        localStorage.setItem("user", username);
        window.location = "dashboard.html";
    } else {
        alert("Invalid login 😭");
    }
}

// 📝 Register
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill all fields 😤");
        return;
    }

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const msg = await res.text();

    if (msg.includes("exists")) {
        alert("User already exists 😒");
    } else {
        alert("Registered successfully 😌 Now login!");
    }
}