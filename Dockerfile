FROM node
MAINTAINER Zinkovskyi

WORKDIR /app

COPY . .
RUN npm install

CMD ["node","./dist/app.js"]