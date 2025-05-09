import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.backgroundColor = "#add8e6";
document.body.style.textAlign = "center";
document.body.style.margin = "0";
document.body.style.padding = "0";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Элемент с id 'root' не найден в документе.");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);