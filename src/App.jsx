// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";

import Home from "./pages/Home";
import Works from "./pages/Works";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Links from "./pages/Links"; // ✅ renamed import

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    dark ? html.classList.add("dark") : html.classList.remove("dark");
  }, [dark]);

  return (
    <div
      className={
        (dark
          ? "dark bg-neutral-950 text-neutral-100"
          : "bg-neutral-50 text-neutral-900") + " min-h-dvh flex flex-col"
      }
    >
      <NavBar dark={dark} setDark={setDark} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/link" element={<Links />} /> {/* ✅ wired */}
        </Routes>
      </div>

      <footer className="border-t border-black/5 dark:border-white/5 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} suji. All rights reserved.
      </footer>
    </div>
  );
}
