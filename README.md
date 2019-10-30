# home-tick

A [TICK](https://www.influxdata.com/blog/introduction-to-influxdatas-influxdb-and-tick-stack/) stack for the home. Get an instance, point a top level domain at it, and
you can use to track metrics of devices in your home. Comes with a secured TICK setup, an api and homepage for you to implement your public your own public
dashboard. I currently use this for tracking air quality data from [these sensors](https://luftdaten.info/).

![PM2.5, PM10, temperature and humidity charts](/charts.png)

This is a project made at home for personal use and with non sensible technology choices on purpose.
It may very well fail, you may find poor implementations and decisions, but for the most part, it's fun to work on.

I'm slowly but surely making everything parameterized so it can be ran by anyone. Christian runs this very same repo for himself :)

## Architecture

Why look at a diagram when you can look at [the architecture itself](docker-compose.production.yml).

All services are packaged as docker containers.

There is one exposed endpoint, the [Caddy proxy](/caddy/Caddyfile), serving content at `$TLD`. It is a front for:

- `write.$TLD`, exposing only the write endpoint of InfluxDB where the sensor's cron job writes data directly, with a few weaker TLS cyphers for compatibility with nodemcu, and secured with HTTP basic auth, the only method supported by the sensor's firmware which I haven't had time to hack yet.;
- `dashboard.$TLD`, the [chronograf](https://www.influxdata.com/time-series-platform/chronograf/), secured with Oauth2 (via github atm, great for whitelisting a Github org with some friends)
- `api.$TLD`, the [API](/api) (written in Go, only one public GET endpoint), will add some caching.
- `$TLD`, the [homepage](/homepage), very WIP, but a static file server with some compiled frontend code, will also have caching.

There is also a [kapacitor](https://github.com/influxdata/kapacitor) endpoint that is not exposed over the public network, for sending
Telegram alerts when a few thresholds are surpassed.

## Deployment

For this to work, you need a machine (the cheapest scaleway instance works) you can SSH to, that is accessible by the internet, and has a top level domain name with A records (both apex and `*`) pointing to it.

### 0. Clone the repo and make it your own

Only for now because of the awkward way things are packaged, mostly because of the next step.

### 1. Make your own .env file

    cp .env.dist .env

Docker-compose automagically sets environment variables from a `.env` file it can find in the same directory as the docker-compose file. That's how
we are doing the very sad secret management here, with a `.env` file on the machine you'll use to deploy. Very soon this will be done in a CI system
and environment variables will be (encrypted and) injected there.

In place of the github environment variables, you may use any of the other Oauth2 provider [settings that Chronograf supports](https://docs.influxdata.com/chronograf/v1.7/administration/managing-security/). **but pick one, otherwise there will be no authentication fronting Chronograf, which would be disastrous**.

Besides oauth2 provider settings for Chronograf, make sure you define these variables in your `.env`:

- `TLD`: buy a top level domain name, point it to a machine where you'll be running this, define that TLD as the environment variable. Cady will take care of setting up TLS certificates for the relevant subdomains with Let's Encrypt.
- `REMOTE_SSH_ADDR`: arguments to connect via ssh and rsync, which we use for deployment. `username@host:port` is valid for instance.
- `SSH_COMMAND`: your ssh command. If you haven't specified what ssh key to use in your `~/.ssh/config`, set this variable to `ssh -i path/to/your.key`. You may leave this empty and the plain `ssh` command will be used.

### 2. Deploy

    make deploy

Deployment here means shipping (over ssh-wrapped rsync) all the files in the current folder, excluding what git ignores, to a server, while there stopping the
current docker-compose services, building new containers and running them. It is very fast, great for rapid development, but totally not a serious thing.

When this is more properly open sourced, it will have a CI build job where secrets are held instead of my machine, images in this repo will be built and pushed to a public
registry for reusability by others, and docker-compose will be used over docker-machine instead of being ran on the server itself.

### 3. Head over to `https://$TLD`!

You can now head over to your top level domain and be met with the public dashboard. For configuring your tick stack (as well as exploring data), go to
`https://dashboard.$TLD`. Have fun!

## A few cool things

- all services are written in Go, so RAM usage is very low at 400mb for all these services (and that includes a database)
- all containers are wired together with a private network, and only the proxy's 443 port is open.
- all docker images are alpine-based and very small
- the alerts are great for detecting a burnt toast or someone taking a shower with the bathroom door open.
