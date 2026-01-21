import "./App.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function App() {
  return (
    <div className="h-screen">
      <RouterProvider router={createRouter({ routeTree })} />
    </div>
  );
}

export default App;
