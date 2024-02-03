FROM --platform=$BUILDPLATFORM node:21-slim

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared

ENV PROMPT_SERVER_PORT=4000
ENV HOSTING=local

RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

CMD ["sh", "-c", "cd backend && npm start"]