FROM node:20-bullseye

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared

#SERVER-related stuff
ENV PROMPT_SERVER=http://localhost
ENV PROMPT_SERVER_PORT=4000

#LLM API Keys
ENV OPEN_AI_API_KEY=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

#database (local|mongodb)
ENV DATABASE_SELECTION=mongodb
ENV MONGODB_URI=mongodb+srv://admin:XGSRf9Lu4hzMa6Bw@cluster0.ayra0.mongodb.net/?retryWrites=true&w=majority

EXPOSE 3000
EXPOSE 3001

CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]