FROM node:24-alpine
WORKDIR /codingproject
RUN apk update && apk add --no-cache \
  g++ \
  gcc \
  python3 
COPY . . 
RUN npm i
EXPOSE 3000
CMD ["node","index.js"]


# Use a stable lightweight Node image
# FROM node:24-alpine

# Set working directory
# WORKDIR /codingproject

# Install build tools for native dependencies
# RUN apk add --no-cache python3 make g++ gcc bash build-base

# Copy only package files first for better caching
# COPY package*.json ./

# Install dependencies
# RUN npm ci

# Copy the rest of the project
# COPY . .

# Expose backend port
# EXPOSE 3000

# Start the app
# CMD ["node", "index.js"]
