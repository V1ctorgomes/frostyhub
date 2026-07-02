FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./

RUN npm install --omit=dev && npm cache clean --force

COPY src ./src

EXPOSE 3001

USER node

CMD ["npm", "start"]
