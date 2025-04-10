FROM node:18-alpine

WORKDIR /app/frontend

COPY . .

# install all the dependencies
RUN npm install

EXPOSE 3000

# start vite react app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

