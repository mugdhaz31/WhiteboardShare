import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import JoinRoom from './components/JoinRoom'
import Home from './pages/Home'
import CreateRoom from './components/CreateRoom'
import Whiteboard from './pages/Whiteboard'
import { socket } from './socket'
import { ToastContainer, toast, Slide } from 'react-toastify'

// Wrapper component to validate room ID
const WhiteboardWrapper = ({ user, users }) => {
  const { roomid } = useParams()
  const [redirect, setRedirect] = useState(false)

  const isValidRoomId = (roomId) => {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidV4Regex.test(roomId)
  }

  useEffect(() => {
    if (!isValidRoomId(roomid)) {
      toast.error("Invalid room ID!")
      setTimeout(() => setRedirect(true), 100) 
    }
  }, [roomid])

  if (redirect) return <Navigate to="/" replace />

  return <Whiteboard user={user} users={users} />
}

function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const handleJoined = (data) => {
      console.log("Got userIsJoined event:", data)
      setUsers(data.users || [])
    }

    const handleNewUser = (data) => {
      console.log("A new user joined the room:", data.name)
      setUsers((prev) => [...prev, data])
    }

    const handleAllUsers = (data) => {
      setUsers(data || [])
    }

    const handleJoinedMessage = (data) => {
      toast.info(`${data.name} joined the room`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      })
    }

    const handleUserDisconnected = (name) => {
      toast.info(`${name} left the room`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      })
    }

    // First remove any old listeners before adding new ones
    socket.off("userIsJoined", handleJoined);
    socket.on("userIsJoined", handleJoined);

    socket.off("newUserJoined", handleNewUser);
    socket.on("newUserJoined", handleNewUser);

    socket.off("allUsers", handleAllUsers);
    socket.on("allUsers", handleAllUsers);

    socket.off("userJoinedMessage", handleJoinedMessage);
    socket.on("userJoinedMessage", handleJoinedMessage);

    socket.off("userDisconnected", handleUserDisconnected);
    socket.on("userDisconnected", handleUserDisconnected);

    return () => {
      socket.off("userIsJoined", handleJoined);
      socket.off("newUserJoined", handleNewUser);
      socket.off("allUsers", handleAllUsers);
      socket.off("userJoinedMessage", handleJoinedMessage);
      socket.off("userDisconnected", handleUserDisconnected);
    }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-room" element={<JoinRoom socket={socket} setUser={setUser} />} />
        <Route path="/create-room" element={<CreateRoom socket={socket} setUser={setUser} />} />
        <Route path='/:roomid' element={<WhiteboardWrapper user={user} users={users} />} />
      </Routes>
    </>
  )
}

export default App;
