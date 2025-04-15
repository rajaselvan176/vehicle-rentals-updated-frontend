import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter once

import App from "./App";
import "./index.css";

// Wrap App with BrowserRouter here
ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
    <App />
  // </BrowserRouter>
);
