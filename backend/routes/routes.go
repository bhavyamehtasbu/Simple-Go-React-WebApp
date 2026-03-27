package routes

import (
	"net/http"
	"user-dashboard-backend/services"
)

// RegisterRoutes defines all the API endpoints
func RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/users", services.LoadUsers)
}
