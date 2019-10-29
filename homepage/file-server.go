package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("dist/"))
	http.Handle("/", fs)

	log.Fatal(http.ListenAndServe(":9090", nil))
}
