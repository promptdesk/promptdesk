docker build -t my-frontend-app .
docker run -v $(pwd)/tmp:/app/tmp -p 4000:4000 my-backend-app