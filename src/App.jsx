import { useState } from "react";
import ThreeWorld  from "./engine/ThreeWorld";
import CloudLoader from "./components/CloudLoader";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <ThreeWorld />
      {!loaded && <CloudLoader onComplete={() => setLoaded(true)} />}
    </>
  );
}