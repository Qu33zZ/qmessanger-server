FROM node:16

WORKDIR /qmessanger/src/server

COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

COPY . .

RUN npm install


RUN npm run build
RUN npx prisma generate
# RUN npx prisma migrate dev --name init

EXPOSE 8080

CMD [ "node", "dist/main" ]