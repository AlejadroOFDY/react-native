import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [backgroundImage, setBackgroundImage] = useState("kame-house.jpg");

  const cambiarFondo = () => {
    setBackgroundImage((prev) =>
      prev === "kame-house.jpg" ? "goku-ssj4.jpg" : "kame-house.jpg",
    );
  };

  return (
    <ThemeContext.Provider value={{ backgroundImage, cambiarFondo }}>
      {children}
    </ThemeContext.Provider>
  );
}
