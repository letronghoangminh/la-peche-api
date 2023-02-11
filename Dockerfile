FROM node:18-bullseye-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./
RUN npm prisma generate

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
