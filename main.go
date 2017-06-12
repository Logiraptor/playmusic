package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

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
	url, err := url.Parse("http://127.0.0.1:9999")
	if err != nil {
		fmt.Println(err)
		return
	}
	proxy := handlers.LoggingHandler(os.Stdout, sameHost(httputil.NewSingleHostReverseProxy(url)))
	fs := http.FileServer(http.Dir("client/build"))

	r := mux.NewRouter()
	r.PathPrefix("/api/").Handler(proxy)
	r.PathPrefix("/").Handler(fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.ListenAndServe("0.0.0.0:"+port, handlers.LoggingHandler(os.Stdout, r))
}
