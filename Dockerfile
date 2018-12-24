FROM node:8

ADD . /app

WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
