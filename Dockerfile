FROM alpine:latest AS project

WORKDIR /app
RUN apk add git
RUN git clone https://github.com/Murashi19/koda-b8-react.git .

FROM node:alpine AS builder
WORKDIR /build
COPY --from=project /app/ .
RUN npm install
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /build/dist/ .
COPY --from=builder /build/nginx.conf /etc/nginx/conf.d/default.conf  
