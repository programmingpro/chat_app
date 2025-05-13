import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false
  },
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Socket>();
  private userRooms = new Map<string, Set<string>>();
  private roomClients = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.error('No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      this.userSockets.set(userId, client);
      this.userRooms.set(client.id, new Set());
      this.logger.log(`Client connected: ${userId} (socket: ${client.id})`);
      
      // Логируем все подключенные сокеты
      this.logger.log('Connected sockets:', Array.from(this.userSockets.entries()).map(([id, socket]) => `${id}: ${socket.id}`));
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket === client) {
        this.userSockets.delete(userId);
        const userRooms = this.userRooms.get(client.id);
        if (userRooms) {
          // Удаляем клиента из всех комнат
          for (const roomName of userRooms) {
            const roomClients = this.roomClients.get(roomName);
            if (roomClients) {
              roomClients.delete(client.id);
              if (roomClients.size === 0) {
                this.roomClients.delete(roomName);
              }
            }
          }
        }
        this.userRooms.delete(client.id);
        this.logger.log(`Client disconnected: ${userId} (socket: ${client.id})`);
        break;
      }
    }
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: string) {
    const roomName = `chat:${chatId}`;
    this.logger.log(`Client ${client.id} joining chat room: ${roomName}`);
    
    try {
      // Добавляем комнату в наш локальный список
      const userRooms = this.userRooms.get(client.id) || new Set();
      userRooms.add(roomName);
      this.userRooms.set(client.id, userRooms);
      
      // Добавляем клиента в список комнаты
      const roomClients = this.roomClients.get(roomName) || new Set();
      roomClients.add(client.id);
      this.roomClients.set(roomName, roomClients);
      
      // Присоединяемся к комнате
      client.join(roomName);
      this.logger.log(`Client ${client.id} joined chat room: ${roomName}`);
      
      // Логируем комнаты пользователя
      this.logger.log(`Client ${client.id} is now in rooms: ${Array.from(userRooms).join(', ')}`);
      
      // Логируем клиентов в комнате
      const clientsInRoom = this.roomClients.get(roomName);
      if (clientsInRoom) {
        this.logger.log(`Room ${roomName} has ${clientsInRoom.size} clients: ${Array.from(clientsInRoom).join(', ')}`);
      }
    } catch (error) {
      this.logger.error(`Error joining room ${roomName}:`, error);
    }
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: string) {
    const roomName = `chat:${chatId}`;
    this.logger.log(`Client ${client.id} leaving chat room: ${roomName}`);
    
    try {
      // Удаляем комнату из нашего локального списка
      const userRooms = this.userRooms.get(client.id);
      if (userRooms) {
        userRooms.delete(roomName);
      }
      
      // Удаляем клиента из списка комнаты
      const roomClients = this.roomClients.get(roomName);
      if (roomClients) {
        roomClients.delete(client.id);
        if (roomClients.size === 0) {
          this.roomClients.delete(roomName);
        }
      }
      
      client.leave(roomName);
      this.logger.log(`Client ${client.id} left chat room: ${roomName}`);
    } catch (error) {
      this.logger.error(`Error leaving room ${roomName}:`, error);
    }
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, payload: { chatId: string, message: any }) {
    const roomName = `chat:${payload.chatId}`;
    this.logger.log(`Broadcasting message to room ${roomName}:`, payload.message);
    
    try {
      // Получаем количество клиентов в комнате
      const roomClients = this.roomClients.get(roomName);
      if (roomClients) {
        this.logger.log(`Room ${roomName} has ${roomClients.size} clients: ${Array.from(roomClients).join(', ')}`);
      } else {
        this.logger.warn(`Room ${roomName} is empty`);
      }
      
      this.server.to(roomName).emit('newMessage', payload.message);
      this.logger.log(`Message broadcasted to room ${roomName}`);
    } catch (error) {
      this.logger.error(`Error broadcasting message to room ${roomName}:`, error);
    }
  }
} 