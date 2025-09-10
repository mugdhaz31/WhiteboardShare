const users = []

const addUser = ({ name, roomCode, host, presenter,socketId }) => {
  const userName = typeof name === "string" ? name : name?.name || "Anonymous";
  const user = {
    name: userName,
    roomCode,
    host: !!host,
    presenter: !!presenter,
    socketId
  };

  users.push(user);
  return users.filter(u => u.roomCode === roomCode);
};


const removeUser = (id) => {
    const index = users.findIndex(user => user.socketId == id)
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.socketId == id)
}

const getUserInRoom = (roomCode) => {
    return users.filter((user) => user.roomCode == roomCode)
}

module.exports = { addUser,removeUser,getUser,getUserInRoom }