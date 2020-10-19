const users = [];

//join user to chat
function joinUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//get room users
function roomUsers(room) {
  return users.filter((user) => user.room === room);
}

//user leaves chat
function userLeaveChat(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users.splice(index, 1)[0];
  }
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeaveChat,
  roomUsers,
};
