# # Production
# FROM node:18-alpine
# WORKDIR /application/frontend
# COPY /package*.json ./
# RUN npm install
# COPY ./ ./
# EXPOSE 3000
# RUN npm run build
# CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]

# # Dev
FROM node:18-alpine
WORKDIR /application/frontend
COPY /package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
