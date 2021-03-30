FROM node:15.12.0-alpine
WORKDIR /usr/app
COPY package*.json /usr/app
RUN npm install
COPY . .
CMD ["npm","start"]
