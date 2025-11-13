FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
