FROM node:18 AS promote-backend

RUN apt-get update

RUN apt-get install sudo -y

WORKDIR /home/node/app

COPY ./requirements.txt .

#RUN apt install git python3 python3-pip -y

#RUN pip3 install -r requirements.txt

COPY --chown=node:node . .

RUN npm install

RUN npm install bcrypt

RUN npm install -g prisma

RUN prisma generate
#RUN sudo chmod -R 777 /home/node

USER node

CMD [ "node", "app.js"]

EXPOSE 3011
