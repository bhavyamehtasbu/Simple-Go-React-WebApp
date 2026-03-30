package services

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

func TestDaysSince(t *testing.T) {
	today := time.Now().Format("2006-01-02")

	days := daysSince(today)

	if days != 0 && days != 1 {
		t.Errorf("Expected 0 or 1, got %d", days)
	}
}

func TestLoadUsers_Success(t *testing.T) {

	mockData := `[{
	"name": "John",
	"createDate": "2024-01-01",
	"passwordChanged": "2024-02-01",
	"lastAccess": "2024-03-01",
	"mfaEnabled": true
	}]`

	// create temp db.json
	err := os.WriteFile("db.json", []byte(mockData), 0644)
	if err != nil {
		t.Fatalf("Failed to create mock db: %v", err)
	}
	defer os.Remove("db.json") // cleanup

	req := httptest.NewRequest("GET", "/users", nil)
	w := httptest.NewRecorder()

	LoadUsers(w, req)

	// check status
	if w.Code != http.StatusOK {
		t.Errorf("Expected 200, got %d", w.Code)
	}

	// check response body
	var resp []map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &resp)
	if err != nil {
		t.Fatalf("Invalid JSON: %v", err)
	}

	if len(resp) != 1 {
		t.Errorf("Expected 1 user, got %d", len(resp))
	}

	if resp[0]["name"] != "John" {
		t.Errorf("Expected John, got %v", resp[0]["Name"])
	}
}

func TestLoadUsers_FileNotFound(t *testing.T) {

	// ensure file does NOT exist
	os.Remove("db.json")

	req := httptest.NewRequest("GET", "/users", nil)
	w := httptest.NewRecorder()

	LoadUsers(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected 500, got %d", w.Code)
	}
}
