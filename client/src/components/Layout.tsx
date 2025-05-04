import React from "react";
//import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Freepik AI Image Tool</h1>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Freepik AI Tool</p>
      </footer>
    </div>
  );
};
