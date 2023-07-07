FROM node:16.3.0 AS promote-frontend

RUN apt-get update

RUN apt-get install sudo -y

WORKDIR /home/node/app

RUN sudo chmod -R 777 /home/node

COPY package*.json ./

RUN npm install

COPY src ./src

COPY public ./public

COPY .env ./

COPY *.js ./

RUN mkdir /home/node/app/node_modules/.cache

RUN sudo chmod -R 777 /home/node/app/node_modules/.cache

USER node

CMD ["npm", "run", "serve"]

EXPOSE 8080