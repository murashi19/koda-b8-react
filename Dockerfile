FROM alpine:latest AS project
WORKDIR /app
COPY package*.json .

FROM node:alpine AS builder
WORKDIR /build
COPY --from=project /app/ .
RUN npm install

ARG VITE_BACKEND_URL=http://localhost:8080
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /build/dist/ .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]