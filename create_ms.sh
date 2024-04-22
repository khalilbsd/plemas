#!/bin/bash

# Check if a directory name is provided as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <project_name>"
    exit 1
fi

# Create a directory with the project name
if [ -d "ms_$1" ]; then
    echo "Directory 'ms_$1' already exists. Aborting."
    exit 1
fi
mkdir "ms_$1"
cd "ms_$1"

# List of directories to create
declare -a arr=("controllers"
"services"
"models"
"routes"
"constants"
"db"
"errors"
"i18n"
"mails"
"middleware"
"uploads"
"utils"
"log"
".encrypt"
)

# Create directories for each microservice
for i in "${arr[@]}"
do
   mkdir "$i"
done

# Create dummy route files
touch routes/example.route.js
touch routes/testExample.route.js

# Copy basic files from server directory
cp ../server/Dockerfile ./
cp ../server/errors/*  ./errors
cp ../server/middleware/*  ./middleware
cp ../server/Utils/*  ./utils
cp ../server/log/*  ./log
cp ../server/i18n/*  ./i18n
cp ../server/mails/config.js  ./mails/config.js
cp ../server/environment.config.js ./
cp ../server/.env ./
cp ../server/.env.dev ./
cp ../server/.encypt/* ./.encypt
# Copy database and index files from templates directory
cp ../templates/db/*  ./db
cp ../templates/index.js ./

# Copy other files from templates directory
cp ../templates/constants/* ./
cp ../templates/package.json ./

# Create a basic index.js file
touch index.js

echo "Default files created for the service $1"

# Install dependencies
npm install

echo "Dependencies installed for the service $1"

# Generate docker-compose.yml
cat > ../docker-compose.yml <<EOL
version: '3.8'

services:
EOL

# Initialize port number
port=8000

# Loop through each microservice directory to add declarations to docker-compose.yml
for service_dir in ../ms_*/; do
    service_name=$(basename "$service_dir")
    cat >> ../docker-compose.dev.yml <<EOL
  $service_name:
    build:
      context: ./$service_name/.
      dockerfile: Dockerfile
    container_name: $service_name
    ports:
      - "$port:5000"
    command: npm run start:dev
    restart: always
    depends_on:
      - mongodb
    environment:
        DB_MONGODB_HOST: mongodb
        DB_MONGODB_PORT: 27017
        DB_USERNAME: its
        DB_PASSWORD: itsedx
        DB_MONGODB_NAME: plemas
    volumes:
      - ./$service_name:/plemas/service

EOL

    # Increment port number
    ((port++))
done

echo "Docker Compose file updated successfully."

echo "Node.js microservices template created successfully in directory $1"
