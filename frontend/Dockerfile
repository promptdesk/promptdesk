FROM node:18-alpine

WORKDIR /app

COPY package.json ./

#copy this directory to ./frontend
COPY . .
#copy ../shared to ./shared
COPY ../shared ./shared

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]