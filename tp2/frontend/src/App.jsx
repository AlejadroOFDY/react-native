import { useState } from "react";
import "./App.css";

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState();
  const [eliminando, setEliminando] = useState();
  const [error, setError] = useState("");

  const traerPersonajes = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch("http://localhost:3000/characters");

      // const respuesta = await fetch("http://localhost:3000/characters/import", {
      //   method: "POST",
      // });
      if (!respuesta.ok) {
        throw new Error("No se pudieron traer los personajes");
      }

      const data = await respuesta.json();
      if (!data || data.length === 0) {
        alert("No hay personajes");
      } else {
        setPersonajes(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const eliminarPersonajes = async () => {
    try {
      setEliminando(true);
      setError("");

      const response = await fetch(
        "http://localhost:3000/characters/delete-all",
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo eliminar los personajes");
      }
      setPersonajes([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <section id="center"></section>
      <h1 className="title">API Dragon Ball</h1>

      <div id="box0">
        <div className="buttons">
          <div className="traer">
            <button onClick={traerPersonajes}>Traer</button>
          </div>
          <div className="crear">
            <button onClick={""}>Crear</button>
          </div>
          <div className="eliminar">
            <button onClick={eliminarPersonajes}>Eliminarlos</button>
          </div>
        </div>

        {cargando && <p className="mensaje">Cargando personajes...</p>}
        {eliminando && <p className="mensaje"> Eliminando personajes...</p>}
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
