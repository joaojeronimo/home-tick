package main

import "os"

var influxDBAddr = ""

func init() {
	influxDBAddr = os.Getenv("INFLUXDB_URL")
	if influxDBAddr == "" {
		panic("required environment variable INFLUXDB_URL is undefined")
	}
}
