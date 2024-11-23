FROM node:22 AS deps

WORKDIR /app
COPY package*.json ./
RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM build AS bot
CMD [ "node", "./dist/apps/bot/src/main.js" ]
