# Etapa 1: Construcción
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html


RUN printf "events { worker_connections 1024; }\nhttp {\n    include /etc/nginx/mime.types;\n    server {\n        listen 80;\n        location / {\n            root /usr/share/nginx/html;\n            index index.html;\n            try_files \$uri \$uri/ /index.html;\n        }\n    }\n}" > /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]