import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { render } from "react-dom";
import React from "react";
import "./index.css";
import { MapComponent as MapPage } from "./pages/map-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapPage />,
  },
]);

render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
