FROM node:18

WORKDIR /pleams/service

# Copy only package.json and package-lock.json
COPY package*.json .
COPY . .
# Install dependencies
RUN npm install
# Copy the rest of the application
EXPOSE 5000

