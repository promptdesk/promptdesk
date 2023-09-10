FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

#COPY . ./

# Add the volume mapping
VOLUME /app

EXPOSE 3000

CMD ["npm", "run", "dev"]