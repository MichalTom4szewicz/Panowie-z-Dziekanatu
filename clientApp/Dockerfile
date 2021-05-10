FROM node as builder
COPY . ./clientApp
WORKDIR /clientApp
RUN npm i
RUN $(npm bin)/ng build --prod

FROM nginx
COPY --from=builder /clientApp/dist/clientApp /usr/share/nginx/html

