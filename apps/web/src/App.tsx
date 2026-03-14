import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ViewTransitionLink } from "./components/ViewTransitionLink";
import { Home } from "./pages/Home";
import { ItemDetail } from "./pages/ItemDetail";
import { Admin } from "./pages/Admin";

function AppLayout() {
  return (
    <div className="app">
      <nav className="nav">
        <ViewTransitionLink to="/">AI Rollout Lab</ViewTransitionLink>
        <ViewTransitionLink to="/admin" className="nav__admin">
          Admin
        </ViewTransitionLink>
      </nav>
      <main className="view-transition-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
