# Use Node.js 18 with Alpine for lightweight image
FROM node:18-alpine

WORKDIR /app/frontend

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Build the app for production
RUN npm run build

# Install a static file server to serve the built React app
RUN npm install -g serve

# Expose port 80 (the port that will be accessible for frontend traffic)
EXPOSE 80

# Serve the static files built by Vite
CMD ["serve", "-s", "dist", "-l", "80"]

