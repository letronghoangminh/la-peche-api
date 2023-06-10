FROM node:18-bullseye-slim

ARG NEW_RELIC_LICENSE_KEY

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./

COPY . .

RUN npx prisma generate

RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build

ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NEW_RELIC_LICENSE_KEY=$NEW_RELIC_LICENSE_KEY
ENV NEW_RELIC_APP_NAME="lapeche"


ENTRYPOINT ["npm", "run", "start:prod"]
