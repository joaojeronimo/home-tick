FROM node:alpine AS web-builder

ARG TLD
ENV TLD=$TLD

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn --frozen-lockfile

ADD . .

RUN yarn build


FROM golang:1.13-alpine AS file-server-builder

WORKDIR /app

ADD file-server.go .

RUN go build -o file-server .


FROM alpine:3.10

WORKDIR /app

COPY --from=web-builder /app/dist /app/dist
COPY --from=file-server-builder /app/file-server /app/file-server

ENTRYPOINT ["./file-server"]