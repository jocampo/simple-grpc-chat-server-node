import grpc from 'grpc';
import protos from '@jocampo/simple-grpc-chat-proto/proto-objects.js';

const chatServiceProto = grpc.loadPackageDefinition(protos).services;
console.log(chatServiceProto)

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

const users = [];

const chat = (call, callback) => {
    users.push(call);
    notifyChat({ user: "Server", text: "new user joined ..." });
};

const sendMessage = (call, callback) => {
    notifyChat(call.request);
};

const notifyChat = (message, callback) => {
    users.forEach(user => {
        user.write(message);
    });
}

server.addService(protos.services.ChatService, {
    join_chat: chat,
    send_message: sendMessage
});

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

server.start();

console.log("Server started");