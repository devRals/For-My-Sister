import { createRoot } from "react-dom/client";
import App from "./app";
import Background from "./bg";

import "./style.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <>
    <Background />
    <App />
  </>,
);
