FROM node:20-alpine

RUN mkdir -p /home/node/home-alarm
RUN chown -R node:node /home/node/home-alarm
WORKDIR /home/node/home-alarm

USER node

COPY --chown=node:node backend/package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node backend/dist ./
COPY --chown=node:node server.crt ./
COPY --chown=node:node server.key ./

RUN mkdir -p public/audio
COPY --chown=node:node frontend/dist public/
COPY --chown=node:node frontend/public/audio public/audio

CMD ["node", "app.js"]