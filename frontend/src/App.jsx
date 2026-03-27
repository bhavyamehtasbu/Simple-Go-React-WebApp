import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserTable from "./components/UserTable";

function App() {
  
  return (
   
    <Router>
      <div className="p-8 bg-gray-50 min-h-screen">

        {/* Nav Bar */}
        <nav className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            User Security Audit
          </h1>

          <div className="flex gap-4">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/users" className="text-blue-600 hover:underline">Users</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<div>Welcome to the Audit Dashboard!</div>} />
          <Route path="/users" element={<UserTable/>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;