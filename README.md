# 🖌️ Whiteboard Share – Real-Time Collaborative Whiteboard with Chat

Whiteboard Share is a real-time collaborative whiteboard web application built with **React**, **Node.js**, **Express**, and **Socket.io**.  
It allows users to **draw**, **undo/redo**, **clear the canvas**, **download drawings**, and **chat in real-time** within a shared room.

---

## 🚀 Features

- ✏️ **Real-Time Drawing** – Host can draw using Pencil, Brush, Line, and Rectangle tools; all users see updates instantly.
- 🎨 **Customizable Tools** – Change brush color and size dynamically.
- ↩️ **Undo / Redo** – Revert or restore actions while drawing.
- 🧹 **Clear Canvas** – Clear the entire canvas with a single click.
- 📥 **Download Drawings** – Save your whiteboard as a PNG image.
- 💬 **Real-Time Chat** – Send and receive messages instantly in the same room.
- 👤 **Presenter/Host Role** – Only the host can draw while others view updates.
- 🌐 **Room-Based Collaboration** – Multiple users can join the same room via a room code.

---

## 🛠 Tech Stack

| Category        | Technology                        |
|-----------------|----------------------------------|
| Frontend        | React, Tailwind CSS, Rough.js, React Router |
| Backend         | Node.js, Express.js, Socket.io   |
| State Management| React useState/useEffect         |
| Others          | HTML Canvas API                  |

---

## 📹 Video Demonstration

### Creating Room
[Watch Video](videos/Screen Recording 2025-09-10 134934.mp4)

### Joining Room
[Watch Video](videos/Screen Recording 2025-09-10 135127.mp4)

### Real-Time Chatting
[Watch Video](videos/Screen Recording 2025-09-10 135238.mp4)

---

## 🧾 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WhiteboardShare.git
   cd WhiteboardShare

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
4. **Run backend server**
   ```bash
   npm start
5. **Run frontend**

   ```bash
   npm run dev