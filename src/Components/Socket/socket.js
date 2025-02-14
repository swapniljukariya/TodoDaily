import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true, // Allow cookies and authentication headers
});

export default socket;