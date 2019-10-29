package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.
		Methods(http.MethodGet).
		PathPrefix("/initial-payload").
		HandlerFunc(getInitialPayloadHandler)

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:9999",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
