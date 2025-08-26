FROM node:24-alpine
WORKDIR /codingproject
RUN apk update && apk add --no-cache python3 make g++ gcc
COPY . . 
RUN npm i
EXPOSE 3000
CMD ["node","index.js"]