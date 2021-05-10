FROM node
COPY . ./server
WORKDIR /server
RUN npm i
ENTRYPOINT [ "npm", "start" ]
EXPOSE 8000