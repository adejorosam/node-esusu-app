FROM node:14

WORKDIR /

COPY package.json .

RUN npm install

RUN npm install sequelize-cli --save


COPY . .

EXPOSE 5000

ENV NODE_OPTIONS=--max_old_space_size=2048

CMD [ "npm", "start" ]