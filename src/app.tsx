import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "@/pages/login";
import { NotFound } from "@/pages/not-found";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
