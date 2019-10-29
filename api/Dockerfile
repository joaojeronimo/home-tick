FROM golang:1.13-alpine AS builder

RUN apk update && apk add git ca-certificates make

WORKDIR /app

COPY . .

RUN make build

FROM scratch

# if this ever needs to make HTTPS requests
# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app /app

ENTRYPOINT ["/app/api"]