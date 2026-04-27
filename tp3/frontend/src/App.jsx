import { useState, useEffect } from "react";
import "./App.css";
import { useSearchCharacter } from "./hooks/searchCharacter";

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [nuevoPersonaje, setNuevoPersonaje] = useState({
    name: "",
    ki: "",
    maxKi: "",
    race: "",
    description: "",
    image: "",
    affiliation: "",
  });
  const [formulario, setFormulario] = useState(false);
  const {
    busqueda,
    setBusqueda,
    mostrarBusqueda,
    setMostrarBusqueda,
    personajesFiltrados,
    personajeEditando,
    setPersonajeEditando,
    formularioEditar,
    setFormularioEditar,
    abrirEditarPersonaje,
    eliminarPersonajeUnico,
    handleInputChangeEditar,
    actualizarPersonaje,
  } = useSearchCharacter(personajes, setPersonajes);

  const traerPersonajes = async () => {
    try {
      setCargando(true);
      setError("");

      await fetch("http://localhost:3000/characters/import", {
        method: "POST",
      });

      const respuesta = await fetch("http://localhost:3000/characters");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPersonaje((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const crearPersonajes = async (e) => {
    e.preventDefault();

    const personajeExistente = personajes.find(
      (p) => p.name.toLowerCase() === nuevoPersonaje.name.toLowerCase(),
    );

    if (personajeExistente) {
      alert("Ya existe el personaje");
      return;
    }

    try {
      setCargando(true);
      setError("");
      const response = await fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPersonaje),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el personaje");
      }

      const personajeCreado = await response.json();
      setPersonajes((prev) => [...prev, personajeCreado]);
      setNuevoPersonaje({
        name: "",
        ki: "",
        maxKi: "",
        race: "",
        description: "",
        image: "",
        affiliation: "",
      });
      setFormulario(false);
      alert("¡Personaje creado exitosamente!");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const abrirFormulario = () => {
    setFormulario(true);
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
      <section id="center">
        <h1 className="title">API Dragon Ball</h1>
        <div id="box0">
          <div className="buttons">
            <div className="traer">
              <button onClick={traerPersonajes}>Traer</button>
            </div>
            <div className="crear">
              <button onClick={abrirFormulario}>Crear</button>
            </div>
            <div className="eliminar">
              <button onClick={eliminarPersonajes}>Eliminarlos</button>
            </div>
          </div>

          {cargando && <p className="mensaje">Cargando...</p>}
          {eliminando && <p className="mensaje"> Eliminando...</p>}
          {error && <p className="error">{error}</p>}

          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar personaje..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
          </div>

          {busqueda && personajesFiltrados.length > 0 && (
            <div className="resultados-busqueda">
              <h3>Resultados de búsqueda ({personajesFiltrados.length})</h3>
              <div className="grid-personajes">
                {personajesFiltrados.map((p) => (
                  <article className="card-personaje" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <h3>{p.name}</h3>
                    <p>Raza: {p.race}</p>
                    <p>Ki: {p.ki}</p>
                    <p>Afiliacion: {p.affiliation}</p>
                    <div className="botones-card">
                      <button
                        className="btn-actualizar"
                        onClick={() => abrirEditarPersonaje(p)}
                      >
                        Actualizar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPersonajeUnico(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {formularioEditar && (
            <div className="modal">
              <div className="modal-contenido">
                <h2>Actualizar personaje</h2>
                <form onSubmit={actualizarPersonaje}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre *"
                    value={personajeEditando?.name || ""}
                    onChange={handleInputChangeEditar}
                    required
                  />
                  <input
                    type="text"
                    name="race"
                    placeholder="Raza *"
                    value={personajeEditando?.race || ""}
                    onChange={handleInputChangeEditar}
                    required
                  />
                  <input
                    type="text"
                    name="ki"
                    placeholder="Ki (ej: 1000)"
                    value={personajeEditando?.ki || ""}
                    onChange={handleInputChangeEditar}
                  />
                  <input
                    type="text"
                    name="maxKi"
                    placeholder="Max Ki"
                    value={personajeEditando?.maxKi || ""}
                    onChange={handleInputChangeEditar}
                  />
                  <input
                    type="text"
                    name="affiliation"
                    placeholder="Afiliación"
                    value={personajeEditando?.affiliation || ""}
                    onChange={handleInputChangeEditar}
                  />
                  <input
                    type="text"
                    name="image"
                    placeholder="URL de la imagen"
                    value={personajeEditando?.image || ""}
                    onChange={handleInputChangeEditar}
                  />
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    value={personajeEditando?.description || ""}
                    onChange={handleInputChangeEditar}
                    rows="3"
                  />

                  <div className="botones-form">
                    <button type="submit">Guardar cambios</button>
                    <button
                      type="button"
                      onClick={() => setFormularioEditar(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {formulario && (
            <div className="modal">
              <div className="modal-contenido">
                <h2>Crear nuevo personaje</h2>
                <form onSubmit={crearPersonajes}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre *"
                    value={nuevoPersonaje.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="race"
                    placeholder="Raza *"
                    value={nuevoPersonaje.race}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="ki"
                    placeholder="Ki (ej: 1000)"
                    value={nuevoPersonaje.ki}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="maxKi"
                    placeholder="Max Ki"
                    value={nuevoPersonaje.maxKi}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="affiliation"
                    placeholder="Afiliación"
                    value={nuevoPersonaje.affiliation}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="image"
                    placeholder="URL de la imagen"
                    value={nuevoPersonaje.image}
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    value={nuevoPersonaje.description}
                    onChange={handleInputChange}
                    rows="3"
                  />

                  <div className="botones-form">
                    <button type="submit" disabled={cargando}>
                      {cargando ? "Creando..." : "Crear personaje"}
                    </button>
                    <button type="button" onClick={() => setFormulario(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!busqueda && (
            <div className="grid-personajes">
              {personajes.length === 0 ? (
                <p className="sin-personajes">
                  No hay personajes cargados. Haz clic en "Traer" para
                  importarlos.
                </p>
              ) : (
                personajes.map((p) => (
                  <article className="card-personaje" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <h3>{p.name}</h3>
                    <p>Raza: {p.race}</p>
                    <p>Ki: {p.ki}</p>
                    <p>Afiliacion: {p.affiliation}</p>
                    <div className="botones-card">
                      <button
                        className="btn-actualizar"
                        onClick={() => abrirEditarPersonaje(p)}
                      >
                        Actualizar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPersonajeUnico(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
