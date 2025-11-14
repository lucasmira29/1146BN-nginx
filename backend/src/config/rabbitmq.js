import amqp from 'amqplib';
import userService from '../services/userService.js';

// Configurações do RabbitMQ
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'rabbitmq';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'admin';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'admin';
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`;

// Constantes do auth-service
const EXCHANGE_NAME = 'auth';
const QUEUE_NAME = 'notification-queue'; // A mesma fila do RabbitConfig.java
const ROUTING_KEY = 'user.created';      // A mesma routing key do RabbitConfig.java

let connection = null;
let channel = null;

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log('✅ [RabbitMQ] Conectado com sucesso.');

    // Garante que o Exchange existe (o mesmo do auth-service)
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    // Garante que a Fila existe (a mesma do auth-service)
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Faz o "bind" (ligação) da fila com o exchange usando a routing key
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    console.log(`[RabbitMQ] Aguardando por mensagens na fila: ${QUEUE_NAME}`);

    // Começa a consumir (ouvir) a fila
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg.content) {
        try {
          const eventData = JSON.parse(msg.content.toString());
          console.log(`[RabbitMQ] Evento [${ROUTING_KEY}] recebido:`, eventData);
          
          // Chama o service para criar/atualizar o usuário no banco Prisma
          await userService.createOrUpdateUserFromEvent(eventData);

          // Confirma o recebimento da mensagem (ACK)
          channel.ack(msg);
        } catch (error) {
          console.error('[RabbitMQ] Erro ao processar evento:', error.message);
          // Rejeita a mensagem e não a coloca de volta na fila
          channel.nack(msg, false, false);
        }
      }
    });

  } catch (error) {
    console.error('❌ [RabbitMQ] Falha ao conectar. Tentando novamente em 5s...', error.message);
    setTimeout(connectToRabbitMQ, 5000); // Tenta reconectar
  }
}

export { connectToRabbitMQ };
