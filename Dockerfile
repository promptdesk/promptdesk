FROM node:20-slim

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared

RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

ENV PROMPT_SERVER=http://localhost
ENV PROMPT_SERVER_PORT=4000
ENV DATABASE_SELECTION=mongodb

CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]