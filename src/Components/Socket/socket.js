import { io } from "socket.io-client";

const socket = io("http://localhost:8001", {
  withCredentials: true, // Allow cookies and authentication headers
});

export default socket;