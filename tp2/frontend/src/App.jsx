import { useState } from "react";
import "./App.css";
import Button from "./components/button";

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const traerPersonajes = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch("http://localhost:3000/characters");
      if (!respuesta.ok) {
        throw new Error("No se pudieron traer los personajes");
      }

      const data = await respuesta.json();
      setPersonajes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <section id="center"></section>
      <h1 className="title">API Dragon Ball</h1>

      <div id="box0">
        <div className="buttons">
          <div className="traer">
            <Button texto="Traer personajes" onClick={traerPersonajes} />
          </div>
          <div className="crear">
            <Button texto="Crear" onClick={""} />
          </div>
          <div className="eliminar">
            <Button texto="Eliminar" onClick={""} />
          </div>
        </div>

        {cargando && <p className="mensaje">Cargando personajes...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid-personajes">
          {personajes.map((p) => (
            <article className="card-personaje" key={p.id}>
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>Raza: {p.race}</p>
              <p>Ki: {p.ki}</p>
              <p>Afiliacion: {p.affiliation}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
