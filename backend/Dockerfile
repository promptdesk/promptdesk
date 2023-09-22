FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

#COPY . ./

# Add the volume mapping
VOLUME /app

EXPOSE 4000

CMD ["npm","run" ,"start"]