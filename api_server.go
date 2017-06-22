package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"time"
)

func apiServer() {
	for {
		buf, err := ioutil.ReadFile(".env")
		if err != nil {
			fmt.Println("Cannot read .env")
			fmt.Println(err)
			return
		}

		envlines := strings.Split(string(buf), "\n")

		cmd := exec.Command("flask", "run", "-p", "9999", "--reload")
		cmd.Env = append(envlines, "FLASK_APP=main.py")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		err = cmd.Run()
		fmt.Println("API SERVER STOPPED")
		fmt.Println(err)
		time.Sleep(time.Second * 3)
		fmt.Println("Restarting API server")
	}
}
