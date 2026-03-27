package main

import (
	"log"
	"net/http"
	"user-dashboard-backend/middleware"
	"user-dashboard-backend/routes"
)

func main() {
	// Initialize the router
	mux := http.NewServeMux()

	// Register all routes from the routes package
	routes.RegisterRoutes(mux)

	// Start the server wrapped in CORS middleware
	log.Println("🚀 Server starting at http://localhost:8080")

	err := http.ListenAndServe(":8080", middleware.Cors(mux))
	if err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
