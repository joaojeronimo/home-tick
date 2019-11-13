package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	client "github.com/influxdata/influxdb1-client/v2"
)

var measurementLabels = []string{"SDS_P1", "SDS_P2", "humidity", "temperature"}

func buildQuery(measurements []string, database string) string {
	query := ""
	for _, measurement := range measurements {
		query = fmt.Sprintf(`%s SELECT last("%s") FROM %s;`, query, measurement, database)
	}
	return query
}

var indoorQuery = client.NewQuery(buildQuery(measurementLabels, `"indoor"."autogen"."feinstaub"`), "indoor", "")
var outdoorQuery = client.NewQuery(buildQuery(measurementLabels, `"outdoor"."autogen"."feinstaub"`), "outdoor", "")

type measurement struct {
	ID    string      `json:"id"`
	Value json.Number `json:"value"`
	Unit  string      `json:"unit,omitempty"`
}

func mapMeasurements(results []client.Result) []measurement {
	measurements := []measurement{}
	for i, result := range results {
		if len(result.Series) <= 0 {
			continue
		}
		measurements = append(measurements, measurement{
			ID:    measurementLabels[i],
			Value: result.Series[0].Values[0][1].(json.Number),
		})
	}
	return measurements
}

func getResults(c client.Client, query client.Query) ([]client.Result, error) {
	response, err := c.Query(query)
	if err != nil {
		return nil, err
	}
	if response.Error() != nil {
		return nil, response.Error()
	}

	return response.Results, nil
}

func getInitialPayloadHandler(w http.ResponseWriter, r *http.Request) {
	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr: influxDBAddr,
	})
	if err != nil {
		fmt.Println("Error creating InfluxDB Client: ", err.Error())
	}
	defer c.Close()

	indoorResults, err := getResults(c, indoorQuery)
	if err != nil {
		panic(err)
	}

	outdoorResults, err := getResults(c, outdoorQuery)
	if err != nil {
		panic(err)
	}

	response := struct {
		Indoor []measurement `json:"indoor"`
		Outdoor []measurement `json:"outdoor"`
	}{
		Indoor: mapMeasurements(indoorResults),
		Outdoor: mapMeasurements(outdoorResults),
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	encoder := json.NewEncoder(w)
	encoder.Encode(response)
}
