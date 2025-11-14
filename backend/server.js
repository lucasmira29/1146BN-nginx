import app from "./src/app.js";
import { registerWithEureka } from "./src/config/eureka.js";
import { connectToRabbitMQ } from "./src/config/rabbitmq.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Servidor 'clinica-service' rodando na porta ${port}`);
  
  registerWithEureka();

  connectToRabbitMQ();
});