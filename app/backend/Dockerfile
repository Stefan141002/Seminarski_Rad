# backend/Dockerfile
FROM node:18

WORKDIR /app

# Kopiraj samo package.json
COPY package.json ./

# Instaliraj sve pakete direktno unutar image-a
RUN npm install

# Kopiraj ostatak koda
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
