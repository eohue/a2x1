import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpServer = createServer(app.getHttpAdapter().getInstance());
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket.io',
  });
  (global as any).io = io;
  app.setGlobalPrefix('api');
  app.enableCors();
  (app as any).io = io;
  await app.init();
  await new Promise<void>((resolve) => httpServer.listen(process.env.PORT ?? 3000, resolve));
}

bootstrap();
