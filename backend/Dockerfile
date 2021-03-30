FROM node:15.12.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm install
COPY . .
CMD ["npm","start"]
