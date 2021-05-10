FROM node
COPY . ./server
WORKDIR /server
RUN npm i
ENTRYPOINT [ "npm", "run", "db:migrate" ]
ENTRYPOINT ["npm", "start" ]
EXPOSE 4848
