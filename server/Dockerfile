FROM node:18

RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
	|  tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
	&& echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
	|  tee /etc/apt/sources.list.d/ngrok.list \
	&&  apt update \
	&&  apt install ngrok



WORKDIR /kairos/server

# Copy only package.json and package-lock.json
COPY package*.json .
COPY . .
# Install dependencies
RUN npm install

RUN ngrok config add-authtoken 2fEeSp4HNv7mLxRsDYh3Bro6XLj_2crU5veK1xHeaTRy9DrEC


RUN ngrok http --domain=fancy-owl-hardy.ngrok-free.app 5000
# Copy the rest of the application
EXPOSE 5000

