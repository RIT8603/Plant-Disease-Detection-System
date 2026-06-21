import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/About.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import Predict from "./pages/Predict.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7fbf5]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
