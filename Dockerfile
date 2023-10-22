FROM node:20-slim

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared
COPY entrypoint.sh /entrypoint.sh

ENV PROMPT_SERVER_PORT=4000
ENV HOSTING=local
ENV USERNAME=admin

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

RUN cp -r ./frontend/dist ./backend/dist

CMD ["sh", "-c", "cd backend && npm start"]