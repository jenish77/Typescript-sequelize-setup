import { Socket } from "socket.io";

const socketToRoom:any = {};
async function chatHandler(client: Socket) {
    console.log('A user connected');
  
    let userId = client.handshake.query['user_id']?.toString() ?? "0"
    
    let clientId = client.id
    socketToRoom[clientId] = 'a_' + userId

    console.log('userId:', userId,clientId,socketToRoom);

    client.on("chat_message", (message) => {
      
      console.log('Received message:', message);
      client.broadcast.emit("chat_message", message);
      // You can emit messages back to the client or perform other actions here
    });
  
    client.on("disconnect", () => {
      console.log('A user disconnected');
    });
  }
  

export default {
  chatHandler
}