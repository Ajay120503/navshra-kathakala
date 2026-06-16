import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import { setReduxStore } from "./api/axios";
import App from "./App";
import "./index.css";

// Pass Redux store to axios for global state management on auth failures
setReduxStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#1C1917",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            success: { iconTheme: { primary: "#16A34A", secondary: "#fff" } },
            error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
