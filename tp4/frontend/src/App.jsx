import { useState, useEffect, useContext, memo, useMemo, useCallback } from "react";
import "./App.css";
import { useSearchCharacter } from "./hooks/searchCharacter";
import { ThemeContext } from "./context/ThemeContext";

const NUEVO_PERSONAJE_VACIO = {
	name: "",
	ki: "",
	maxKi: "",
	race: "",
	description: "",
	image: "",
	affiliation: "",
};

const CardPersonaje = memo(function CardPersonaje({ personaje, onActualizar, onEliminar }) {
	return (
		<article className="card-personaje">
			<img src={personaje.image} alt={personaje.name} />
			<h3>{personaje.name}</h3>
			<p>Raza: {personaje.race}</p>
			<p>Ki: {personaje.ki}</p>
			<p>Afiliacion: {personaje.affiliation}</p>
			<div className="botones-card">
				<button className="btn-actualizar" onClick={() => onActualizar(personaje)}>
					Actualizar
				</button>
				<button className="btn-eliminar" onClick={() => onEliminar(personaje.id)}>
					Eliminar
				</button>
			</div>
		</article>
	);
});

const CrearPersonajeModal = memo(function CrearPersonajeModal({
	cargando,
	nuevoPersonaje,
	onSubmit,
	onInputChange,
	onCerrar,
}) {
	return (
		<div className="modal">
			<div className="modal-contenido">
				<h2>Crear nuevo personaje</h2>
				<form onSubmit={onSubmit}>
					<input
						type="text"
						name="name"
						placeholder="Nombre *"
						value={nuevoPersonaje.name}
						onChange={onInputChange}
						required
					/>
					<input
						type="text"
						name="race"
						placeholder="Raza *"
						value={nuevoPersonaje.race}
						onChange={onInputChange}
						required
					/>
					<input
						type="text"
						name="ki"
						placeholder="Ki (ej: 1000)"
						value={nuevoPersonaje.ki}
						onChange={onInputChange}
					/>
					<input
						type="text"
						name="maxKi"
						placeholder="Max Ki"
						value={nuevoPersonaje.maxKi}
						onChange={onInputChange}
					/>
					<input
						type="text"
						name="affiliation"
						placeholder="Afiliación"
						value={nuevoPersonaje.affiliation}
						onChange={onInputChange}
					/>
					<input
						type="text"
						name="image"
						placeholder="URL de la imagen"
						value={nuevoPersonaje.image}
						onChange={onInputChange}
					/>
					<textarea
						name="description"
						placeholder="Descripción"
						value={nuevoPersonaje.description}
						onChange={onInputChange}
						rows="3"
					/>

					<div className="botones-form">
						<button type="submit" disabled={cargando}>
							{cargando ? "Creando..." : "Crear personaje"}
						</button>
						<button type="button" onClick={onCerrar}>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
});

function App() {
	const [personajes, setPersonajes] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [eliminando, setEliminando] = useState(false);
	const [error, setError] = useState("");
	const { backgroundImage, cambiarFondo } = useContext(ThemeContext);
	const [nuevoPersonaje, setNuevoPersonaje] = useState(NUEVO_PERSONAJE_VACIO);
	const [formulario, setFormulario] = useState(false);

	const {
		busqueda,
		setBusqueda,
		personajesFiltrados,
		personajeEditando,
		formularioEditar,
		setFormularioEditar,
		abrirEditarPersonaje,
		eliminarPersonajeUnico,
		handleInputChangeEditar,
		actualizarPersonaje,
	} = useSearchCharacter(personajes, setPersonajes);

	useEffect(() => {
		document.body.style.backgroundImage = `url(/${backgroundImage})`;
	}, [backgroundImage]);

	const personajesAMostrar = useMemo(() => {
		return busqueda ? personajesFiltrados : personajes;
	}, [busqueda, personajes, personajesFiltrados]);

	const abrirFormulario = useCallback(() => {
		setFormulario(true);
	}, []);

	const cerrarFormulario = useCallback(() => {
		setFormulario(false);
	}, []);

	const resetNuevoPersonaje = useCallback(() => {
		setNuevoPersonaje(NUEVO_PERSONAJE_VACIO);
	}, []);

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setNuevoPersonaje((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const traerPersonajes = useCallback(async () => {
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
	}, []);

	const crearPersonajes = useCallback(
		async (e) => {
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
				resetNuevoPersonaje();
				setFormulario(false);
				alert("¡Personaje creado exitosamente!");
			} catch (err) {
				setError(err.message);
			} finally {
				setCargando(false);
			}
		},
		[nuevoPersonaje, personajes, resetNuevoPersonaje],
	);

	const eliminarPersonajes = useCallback(async () => {
		try {
			setEliminando(true);
			setError("");

			const response = await fetch("http://localhost:3000/characters/delete-all", {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("No se pudo eliminar los personajes");
			}
			setPersonajes([]);
		} catch (err) {
			setError(err.message);
		} finally {
			setEliminando(false);
		}
	}, []);

	const handleActualizarPersonaje = useCallback(
		(personaje) => {
			abrirEditarPersonaje(personaje);
		},
		[abrirEditarPersonaje],
	);

	const handleEliminarPersonaje = useCallback(
		(id) => {
			eliminarPersonajeUnico(id);
		},
		[eliminarPersonajeUnico],
	);

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
						<div className="cambiar">
							<button onClick={cambiarFondo}>Cambiar</button>
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

					{busqueda && (
						<div className="resultados-busqueda">
							<h3>Resultados de búsqueda ({personajesAMostrar.length})</h3>
							<div className="grid-personajes">
								{personajesAMostrar.length === 0 ? (
									<p className="sin-personajes">No se encontraron personajes.</p>
								) : (
									personajesAMostrar.map((p) => (
										<CardPersonaje
											key={p.id}
											personaje={p}
											onActualizar={handleActualizarPersonaje}
											onEliminar={handleEliminarPersonaje}
										/>
									))
								)}
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
										<button type="button" onClick={() => setFormularioEditar(false)}>
											Cancelar
										</button>
									</div>
								</form>
							</div>
						</div>
					)}

					{formulario && (
						<CrearPersonajeModal
							cargando={cargando}
							nuevoPersonaje={nuevoPersonaje}
							onSubmit={crearPersonajes}
							onInputChange={handleInputChange}
							onCerrar={cerrarFormulario}
						/>
					)}

					{!busqueda && (
						<div className="grid-personajes">
							{personajesAMostrar.length === 0 ? (
								<p className="sin-personajes">
									No hay personajes cargados. Haz clic en "Traer" para importarlos.
								</p>
							) : (
								personajesAMostrar.map((p) => (
									<CardPersonaje
										key={p.id}
										personaje={p}
										onActualizar={handleActualizarPersonaje}
										onEliminar={handleEliminarPersonaje}
									/>
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
