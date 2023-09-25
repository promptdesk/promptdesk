FROM node:20-bullseye

WORKDIR /app

COPY package.json ./

RUN npm install

#COPY . ./

# Add the volume mapping
VOLUME /src

EXPOSE 4000

CMD ["npm", "run" ,"start"]