import  React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function UserTable() {
  const [mfaFilter, setMfaFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [data, setData] = useState([]);
  const columns = [
    { label: "Human User", key: "name" },
    { label: "Create Date", key: "createDate" },
    { label: "Password Changed Date", key: "passwordChanged" },
    { label: "Days since last password change", key: "daysSincePasswordChange" },
    { label: "Last Access Date", key: "lastAccess" },
    { label: "Days since Last Access", key: "daysSinceLastAccess" },
    { label: "MFA Enabled", key: "mfaEnabled" },
  ];

  // Fetch data once
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Fetch error:", err));
  }, []);


  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === key && sortConfig.direction === "desc") direction = "";
    setSortConfig({ key: direction ? key : "", direction });
  };

  const filteredData =  data
      .filter((user) => {
        if (mfaFilter === "enabled") return user.mfaEnabled;
        if (mfaFilter === "disabled") return !user.mfaEnabled;
        return true;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Filter by MFA:</label>
        <select
          value={mfaFilter}
          onChange={(e) => setMfaFilter(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>

        <button
          onClick={exportToExcel}
          className="ml-auto bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
        >
          Export to Excel
        </button>
      </div>

      <span className="text-sm text-gray-500">{filteredData.length} users</span>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mt-2">
        <div className="overflow-auto max-h-[75vh]">
          <table className="w-full min-w-[1000px] border-collapse">
            {/* Header */}
            <thead className="bg-gray-100 sticky top-0 z-30">
              <tr>
                {columns.map((col, idx) => {
                  const arrow =
                    sortConfig.key === col.key
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : sortConfig.direction === "desc"
                        ? "↓"
                        : ""
                      : "";
                  return (
                    <th
                      key={col.key}
                      className={`px-6 py-3 text-sm font-semibold text-gray-600 border-b cursor-pointer select-none ${
                        idx === 0
                          ? "sticky left-0 z-40 bg-gray-100 shadow-sm text-left"
                          : "text-center"
                      }`}
                      style={{ minWidth: idx === 0 ? "220px" : "150px" }}
                      onClick={() => requestSort(col.key)}
                    >
                      <div
                        className={`flex items-center ${
                          idx === 0 ? "justify-start" : "justify-center"
                        } gap-1`}
                      >
                        {col.label} {arrow && <span className="text-gray-500">{arrow}</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredData.map((user, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group hover:bg-gray-100 transition-colors"
                >
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-800 sticky left-0 z-20 bg-white shadow-sm group-hover:bg-gray-100 transition-colors"
                    style={{ minWidth: "220px" }}
                  >
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    {user.createDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    {user.passwordChanged}
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    <span
                      className={`${
                        user.daysSincePasswordChange > 365
                          ? "text-orange-600 font-semibold"
                          : ""
                      }`}
                    >
                      {user.daysSincePasswordChange}
                      {user.daysSincePasswordChange > 365 && " ⚠️"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    {user.lastAccess}
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    <span
                      className={`${
                        user.daysSinceLastAccess > 90
                          ? "text-orange-600 font-semibold"
                          : ""
                      }`}
                    >
                      {user.daysSinceLastAccess}
                      {user.daysSinceLastAccess > 90 && " ⚠️"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center group-hover:bg-gray-100 transition-colors">
                    {user.mfaEnabled ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}