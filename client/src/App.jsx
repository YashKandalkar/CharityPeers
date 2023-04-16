import CharityPage from "./components/CharityPage";
import Main from "./components/Main";
import { EthProvider } from "./contexts/EthContext";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <div>404</div>,
  },
  {
    path: "/charity/:id",
    element: <CharityPage />,
  },
]);

function App() {
  return (
    <EthProvider>
      <RouterProvider router={router} />
    </EthProvider>
  );
}

export default App;
