package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	client "github.com/influxdata/influxdb1-client/v2"
)

var measurementLabels = []string{"SDS_P1", "SDS_P2", "humidity", "temperature"}

func buildQuery(measurements []string) string {
	query := ""
	for _, measurement := range measurements {
		query = fmt.Sprintf(`%s SELECT last("%s") FROM "indoor"."autogen"."feinstaub";`, query, measurement)
	}
	return query
}

var query = client.NewQuery(buildQuery(measurementLabels), "indoor", "")

type measurement struct {
	Label string      `json:"label"`
	Value json.Number `json:"value"`
	Unit  string      `json:"unit,omitempty"`
}
type response []measurement

func mapMeasurements(results []client.Result) response {
	r := response{}
	for i, result := range results {
		r = append(r, measurement{
			Label: measurementLabels[i],
			Value: result.Series[0].Values[0][1].(json.Number),
		})
	}
	return r
}

func getInitialPayloadHandler(w http.ResponseWriter, r *http.Request) {
	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr: influxDBAddr,
	})
	if err != nil {
		fmt.Println("Error creating InfluxDB Client: ", err.Error())
	}
	defer c.Close()

	response, err := c.Query(query)
	if err != nil {
		panic(err)
	}
	if response.Error() != nil {
		panic(response.Error())
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(mapMeasurements(response.Results))
}
