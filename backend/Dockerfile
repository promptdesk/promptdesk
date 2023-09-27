FROM node:20-bullseye

WORKDIR /app

COPY package.json ./

RUN npm install

#VOLUME /src

#copy this directory to ./frontend
COPY ../frontend ./frontend
#copy ../shared to ./shared
COPY ../shared ./shared

EXPOSE 4000

CMD ["npm", "run" ,"start"]