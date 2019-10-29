FROM alpine:3

RUN apk --no-cache add tar curl

RUN curl "https://caddyserver.com/download/linux/amd64?license=personal&telemetry=off" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy

WORKDIR /app

ADD ./Caddyfile .

CMD ["caddy", "-quic", "--conf", "./Caddyfile"]
