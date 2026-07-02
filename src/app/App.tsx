import { BrowserRouter } from "react-router-dom";
import { ListStoreHydrator } from "@/app/ListStoreHydrator";
import { AppRoutes } from "@/app/routes";

export default function App() {
  return (
    <BrowserRouter>
      <ListStoreHydrator />
      <AppRoutes />
    </BrowserRouter>
  );
}
