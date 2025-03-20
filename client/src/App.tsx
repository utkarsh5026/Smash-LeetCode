import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.getElementById("root")?.classList.add("dark");
  }, []);
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  );
}

export default App;
