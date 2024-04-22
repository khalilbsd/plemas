#!/bin/bash

# Check if a directory name is provided as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <project_name>"
    exit 1
fi




# Check if PLEMAS_MODE environment variable is set
if [ -z "$PLEMAS_MODE" ]; then
    echo "Error: PLEMAS_MODE environment variable is not set."
    exit 1
fi

# Store the value of PLEMAS_MODE environment variable in a variable
PLEMAS_MODE_VAR=$PLEMAS_MODE
# Use the variable later in the script
echo "PLEMAS_MODE environment variable value:$PLEMAS_MODE_VAR"
 docker_file="../docker-compose.$PLEMAS_MODE_VAR.yml"


# Check if the ms_ service is declared in the docker-compose.yml file
#  grep -q "ms_$1" "docker-compose.$PLEMAS_MODE_VAR.yml"

if   grep -q "ms_$1" "docker-compose.$PLEMAS_MODE_VAR.yml"; then
    echo "$service already running."
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
cp ../server/*encypt/* ./*encypt
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
# npm install

echo "Dependencies installed for the service $1"

# Check if docker-compose.yml exists
if [ ! -f "$docker_file" ]; then
    # Generate docker-compose.yml if it doesn't exist
    cat > $docker_file <<EOL

version: '3.8'

services:
EOL
fi


# Get the last port number used
last_port=$(awk '/ports:/ {split($2, a, ":"); print a[1]}' "$docker_file" | sort -nr | head -n1)
echo "last port $last_port inside the $docker_file"
# Initialize port number
if [ -z "$last_port" ]; then
    port=8000
else
    port=$((last_port + 1))
fi
echo "last port 2 $port"

# Add the new service declaration to docker-compose.yml
service_name=$(basename "ms_$1")
cat >> "$docker_file" <<EOL
  $service_name:
    build:
      context: ./$service_name/.
      dockerfile: Dockerfile
    container_name: $service_name
    ports: $port:5000
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
      - ./files:/plemas/service/uploads


EOL

echo "Service $service_name added to Docker Compose file."

echo "Node.js microservices template created successfully in directory $1"
