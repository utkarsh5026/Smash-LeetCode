import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import Leetcode from "./components/leetcode/Leetcode";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.getElementById("root")?.classList.add("dark");
  }, []);
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/leetcode/*" element={<Leetcode />} />
    </Routes>
  );
}

export default App;
