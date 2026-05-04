import { useState, useEffect } from "react";

export const useSearchCharacter = (personajes, setPersonajes = () => {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [personajesFiltrados, setPersonajesFiltrados] = useState([]);
  const [personajeEditando, setPersonajeEditando] = useState(null);
  const [formularioEditar, setFormularioEditar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (busqueda.trim() === "") {
      setPersonajesFiltrados([]);
    } else {
      const filtrados = personajes.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase()),
      );
      setPersonajesFiltrados(filtrados);
    }
  }, [busqueda, personajes]);

  const actualizarPersonaje = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      const response = await fetch(
        `http://localhost:3000/characters/${personajeEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(personajeEditando),
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo actualizar el personaje");
      }

      setPersonajes((prev) =>
        prev.map((p) =>
          p.id === personajeEditando.id ? personajeEditando : p,
        ),
      );
      alert("¡Actualización exitosa!");
      setFormularioEditar(false);
      setPersonajeEditando(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const abrirEditarPersonaje = (personaje) => {
    setPersonajeEditando(personaje);
    setFormularioEditar(true);
  };

  const eliminarPersonajeUnico = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este personaje?")) {
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:3000/characters/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("No se pudo eliminar el personaje");
        }

        setPersonajes((prev) => prev.filter((p) => p.id !== id));
        alert("¡Personaje eliminado exitosamente!");
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
  };

  const handleInputChangeEditar = (e) => {
    const { name, value } = e.target;
    setPersonajeEditando((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    busqueda,
    setBusqueda,
    mostrarBusqueda,
    setMostrarBusqueda,
    personajesFiltrados,
    personajeEditando,
    setPersonajeEditando,
    formularioEditar,
    setFormularioEditar,
    cargando,
    error,
    setError,
    actualizarPersonaje,
    abrirEditarPersonaje,
    eliminarPersonajeUnico,
    handleInputChangeEditar,
  };
};
