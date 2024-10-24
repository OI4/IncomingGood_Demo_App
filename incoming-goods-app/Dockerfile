# Stage 1: Build React App
FROM node:16-alpine as build

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the React app for production
RUN npm run build

# Debugging step (optional) to ensure build was successful
RUN ls -la /app/build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the built React app to NGINX's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX configuration for handling client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the app
EXPOSE 3000

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]