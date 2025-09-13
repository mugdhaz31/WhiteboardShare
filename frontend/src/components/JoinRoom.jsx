import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const JoinRoom = ({socket , setUser}) => {
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      alert("Please enter the room code!");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    const userData = {
      name,
      roomCode,
      host: false,
      presenter: false,
      userId: uuidv4(),
    };

    setUser(userData);
    console.log("Emitting user joined", userData);
    socket.emit("userJoined", userData);
    navigate(`/${roomCode}`, { state: { username: name } });

  };
    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <div className="w-[350px] border border-gray-300 rounded-2xl shadow-lg p-6 bg-white">
                <h3 className="text-2xl font-semibold text-black text-center mb-6">Join Room</h3>
                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                    </label>
                    <input type="text" value={name}  onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2 border border-gray-400 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-black focus:border-black"/>
                </div>
                 <div className="mb-4">
                    <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
                    <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Enter room code" className="w-full px-3 py-2 border border-gray-400 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-black focus:border-black"/>
                </div>
                <button  onClick={handleJoinRoom} className="w-full mt-6 bg-gradient-to-r from-black to-gray-800 py-3 rounded-xl text-white font-semibold text-lg shadow-lg hover:from-gray-900 hover:to-black active:scale-95 transition-all duration-300">
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default JoinRoom
