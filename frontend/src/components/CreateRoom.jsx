import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateRoom = ({socket, setUser}) => {
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleGenerateCode = () => {
        const newCode = uuidv4();
        setRoomCode(newCode);
    };

    const handleCopyCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            alert("Room code copied!");
        }
    };

    const handleCreateRoom = () => {
        if (!name.trim()) {
            alert("Please enter your name!");
            return;
        }
        if (!roomCode) {
            alert("Please generate a room code first!");
            return;
        }
        const roomData = {
            name,
            roomCode,
            host: true,
            presenter: true
        }
        setUser(roomData)
        navigate(`/${roomCode}`, { state: { username: name } });
        socket.emit("userJoined",roomData)
        console.log("Emitting user joined", roomData);
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <div className="w-[350px] border border-gray-300 rounded-2xl shadow-lg p-6 bg-white">
                <h3 className="text-2xl font-semibold text-black text-center mb-6">Create Room</h3>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input  type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2 border border-gray-400 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-black focus:border-black"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1"> Room Code</label>
                    <input type="text" value={roomCode} placeholder="Click Generate" className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-gray-50 
                                   focus:outline-none" readOnly />
                </div>
                <div className="flex gap-3">
                    <button onClick={handleGenerateCode} className="flex-1 bg-black py-2.5 rounded-lg text-white font-semibold shadow-md hover:bg-gray-900 hover:shadow-lg active:scale-95 transition duration-200">
                        Generate Code
                    </button>
                    <button onClick={handleCopyCode} disabled={!roomCode} className="flex-1 bg-gray-700 py-2.5 rounded-lg text-white font-semibold shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Copy Code
                    </button>
                </div>
                <button onClick={handleCreateRoom} className="w-full mt-6 bg-gradient-to-r from-black to-gray-800 py-3 rounded-xl text-white font-semibold text-lg shadow-lg hover:from-gray-900 hover:to-black active:scale-95 transition-all duration-300">
                    Create Room
                </button>
            </div>
        </div>
    )
}

export default CreateRoom
