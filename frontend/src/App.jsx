
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Segments from "./pages/Segments";
import Anomalies from "./pages/Anomalies";
import CustomerAnalyze from "./pages/CustomerAnalyze";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/segments" element={<Segments />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/analyze" element={<CustomerAnalyze />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

