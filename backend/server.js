//This is the main entry point to the backend server.

const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

require('dotenv').config();

connectDB();

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET','POST'],
    credentials: true
  }
});

// Namespaces
const adminNamespace = io.of('/admin');
const userNamespace = io.of('/user');

adminNamespace.on('connection', socket => {
  console.log('Admin connected:', socket.id);
  // Further event handlers if needed
});
userNamespace.on('connection', async socket => {
  console.log('User connected:', socket.id);

  // Authenticate user to join room by token query param
  try {
    const token = socket.handshake.query.token;
    if(!token) {
      socket.disconnect();
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user) {
      socket.disconnect();
      return;
    }
    socket.join(user._id.toString());
  } catch(e) {
    socket.disconnect();
  }
});

module.exports = { io, adminNamespace, userNamespace };

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));