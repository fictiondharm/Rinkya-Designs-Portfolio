import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ThreeWorld from "./engine/ThreeWorld";
import CloudLoader from "./components/CloudLoader";
import AdminApp from "./admin/AdminApp";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={
        <>
          <ThreeWorld />
          {!loaded && <CloudLoader onComplete={() => setLoaded(true)} />}
        </>
      } />
    </Routes>
  );
}
