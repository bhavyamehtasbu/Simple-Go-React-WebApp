package models

type User struct {
	Name            string `json:"name"`
	CreateDate      string `json:"createDate"`
	PasswordChanged string `json:"passwordChanged"`
	LastAccess      string `json:"lastAccess"`
	MFAEnabled      bool   `json:"mfaEnabled"`
}

// Response struct (includes computed fields)
type UserResponse struct {
	Name                    string `json:"name"`
	CreateDate              string `json:"createDate"`
	PasswordChanged         string `json:"passwordChanged"`
	DaysSincePasswordChange int    `json:"daysSincePasswordChange"`
	LastAccess              string `json:"lastAccess"`
	DaysSinceLastAccess     int    `json:"daysSinceLastAccess"`
	MFAEnabled              bool   `json:"mfaEnabled"`
}
