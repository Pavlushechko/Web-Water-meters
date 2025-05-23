import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react' 
import App from "./App.tsx";

document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.backgroundColor = "#add8e6";
document.body.style.textAlign = "center";
document.body.style.margin = "0";
document.body.style.padding = "0";
document.documentElement.style.minWidth = "1180px";


const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Элемент с id 'root' не найден в документе.");
}

const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* <-- Обёртка PersistGate */}
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </PersistGate>
  </Provider>
);