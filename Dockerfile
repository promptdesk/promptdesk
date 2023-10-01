FROM node:20-slim

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared

ENV PROMPT_SERVER=http://localhost
ENV PROMPT_SERVER_PORT=4000
ENV DATABASE_SELECTION=mongodb

CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]