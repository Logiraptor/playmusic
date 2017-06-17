package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"os/exec"

	"io/ioutil"

	"strings"

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

	r := mux.NewRouter()
	r.PathPrefix("/api/").Handler(proxy)
	r.PathPrefix("/").Handler(fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.ListenAndServe("0.0.0.0:"+port, handlers.LoggingHandler(os.Stdout, r))
}

func apiServer() {
	buf, err := ioutil.ReadFile(".env")
	if err != nil {
		fmt.Println("Cannot read .env")
		fmt.Println(err)
		return
	}

	envlines := strings.Split(string(buf), "\n")

	cmd := exec.Command("flask", "run", "-p", "9999")
	cmd.Env = append(envlines, "FLASK_APP=main.py")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	fmt.Println("API SERVER STOPPED")
	fmt.Println(err)
}
