package services

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
	"user-dashboard-backend/models"
)

func fetchUsersFromDb() ([]models.User, error) {
	file, err := os.ReadFile("db.json")
	if err != nil {
		return nil, err
	}
	var users []models.User
	err = json.Unmarshal(file, &users)
	return users, err
}

func daysSince(dateStr string) int {
	t, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return 0
	}
	now := time.Now()
	t = t.Truncate(24 * time.Hour)
	now = now.Truncate(24 * time.Hour)

	return int(now.Sub(t).Hours() / 24)
}

func LoadUsers(w http.ResponseWriter, r *http.Request) {
	users, err := fetchUsersFromDb()
	if err != nil {
		http.Error(w, "Failed to load users", 500)
		return
	}

	var response []models.UserResponse
	for _, u := range users {
		response = append(response, models.UserResponse{
			Name:                    u.Name,
			CreateDate:              u.CreateDate,
			PasswordChanged:         u.PasswordChanged,
			DaysSincePasswordChange: daysSince(u.PasswordChanged),
			LastAccess:              u.LastAccess,
			DaysSinceLastAccess:     daysSince(u.LastAccess),
			MFAEnabled:              u.MFAEnabled,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
