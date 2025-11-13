import { Eureka } from 'eureka-js-client';

const PORT = process.env.PORT || 3000;

const EUREKA_HOST = process.env.EUREKA_HOST || 'service-discovery';
const EUREKA_PORT = process.env.EUREKA_PORT || 8080;

const client = new Eureka({
  instance: {
    app: 'CLINICA-SERVICE', 
    hostName: 'clinica-service', 
    ipAddr: 'clinica-service',
    statusPageUrl: `http://clinica-service:${PORT}/api`,
    port: {
      '$': PORT,
      '@enabled': 'true',
    },
    vipAddress: 'clinica-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: EUREKA_HOST,
    port: EUREKA_PORT,
    servicePath: '/eureka/apps/',
  },
});

export function registerWithEureka() {
  console.log(`Tentando registro no Eureka em ${EUREKA_HOST}:${EUREKA_PORT}...`);
  
  client.start((error) => {
    if (error) {
      console.error('Erro no registro com o Eureka:', error);
      setTimeout(registerWithEureka, 5000);
      return;
    }
    console.log('✅ Node.js (CLINICA-SERVICE) registrado no Eureka com sucesso!');
  });
}