package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"encoding/json"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func sameHost(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Host = r.URL.Host
		handler.ServeHTTP(w, r)
	})
}

func main() {
	go apiServer()

	url, err := url.Parse("http://127.0.0.1:9999")
	if err != nil {
		fmt.Println(err)
		return
	}
	proxy := handlers.LoggingHandler(os.Stdout, sameHost(httputil.NewSingleHostReverseProxy(url)))
	fs := http.FileServer(http.Dir("client/build"))

	q := &queueServer{}

	r := mux.NewRouter()
	r.PathPrefix("/api/").Handler(proxy)
	r.PathPrefix("/queue/list").HandlerFunc(httpWithError(q.List))
	r.PathPrefix("/queue/add").HandlerFunc(httpWithError(q.Add))
	r.PathPrefix("/queue/clear").HandlerFunc(httpWithError(q.Clear))
	r.PathPrefix("/queue/play").HandlerFunc(httpWithError(q.Play))
	r.PathPrefix("/").Handler(fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.ListenAndServe("0.0.0.0:"+port, handlers.LoggingHandler(os.Stdout, r))
}

func httpWithError(handler func(rw http.ResponseWriter, req *http.Request) error) http.HandlerFunc {
	return func(rw http.ResponseWriter, req *http.Request) {
		err := handler(rw, req)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
		}
	}
}

type queueServer struct {
}

func (q *queueServer) List(rw http.ResponseWriter, req *http.Request) error {
	return withState(func(a *AppState) error {
		return json.NewEncoder(rw).Encode(a)
	})
}

func (q *queueServer) Add(rw http.ResponseWriter, req *http.Request) error {
	var s Song
	err := json.NewDecoder(req.Body).Decode(&s)
	if err != nil {
		return err
	}
	return withState(func(a *AppState) error {
		a.Queue = append(a.Queue, s)
		return json.NewEncoder(rw).Encode(struct{}{})
	})
}

func (q *queueServer) Clear(rw http.ResponseWriter, req *http.Request) error {
	return withState(func(a *AppState) error {
		a.Queue = []Song{}
		a.Position = -1
		return json.NewEncoder(rw).Encode(a)
	})
}

func (q *queueServer) Play(rw http.ResponseWriter, req *http.Request) error {
	var s struct {
		Index int `json:"index"`
	}
	err := json.NewDecoder(req.Body).Decode(&s)
	if err != nil {
		return err
	}
	return withState(func(a *AppState) error {
		a.Position = s.Index
		return json.NewEncoder(rw).Encode(struct{}{})
	})
}
