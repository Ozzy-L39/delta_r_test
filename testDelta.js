import { io } from "socket.io-client";

let socket;
let heartbeatInterval;
let lastResponseTime = Date.now();
let responsed = false;

function connect(ipAddress, port) {
  socket = io(`http://${ipAddress}:${port}`, {
    transports: ["websocket"],
    autoConnect: false,
    timeout: 5000,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("Connected to devices");
    setConnectionStatus(true);
    startHeartbeat();
  });

  socket.on("drone_data", (data) => {
    console.log("📡 Drone Data:");
    // If data is a JSON string
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    createDetectionObject(parsed);
  });

  socket.on("status", (data) => {
    console.log("⚠️ Status Alert:");
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    console.log(parsed);
  });

  socket.on("ping_pong", (data) => {
    console.log("🏓 Ping Response:", data);
    lastResponseTime = Date.now();
    setConnectionStatus(true);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from device");
    setConnectionStatus(false);
    stopHeartbeat();
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Failed to connect:", error.message || error);
    disconnect();
    stopHeartbeat();
  });
}

/* ===== Helper stubs (replace with real logic) ===== */

function setConnectionStatus(status) {
  console.log("Connection status:", status);
}


function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  console.log("Heartbeat started");

  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected) {
      console.log("💓 Sending heartbeat ping...");
      socket.emit("ping_pong", { timestamp: Date.now() });

      // If last response was more than 10 seconds ago, mark connection as down
      if (Date.now() - lastResponseTime > 10000) {
        console.warn("⚠️ No heartbeat response for 10s, connection might be down");
        setConnectionStatus(false);
      }
    }
  }, 3000); // ping every 3 seconds
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  console.log("Heartbeat stopped");
}

function disconnect() {
  if (socket) socket.disconnect();
}

function createDetectionObject(data) {
  console.log("Processed drone data:", data);
}

/* ===== Example usage ===== */
connect("192.168.31.25", 5000);