import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React, { useState } from "react";
import TableInfo from "./component/TableInfo";
import { microservicio1 } from "./service/microservicio1";
import { microservicio2 } from "./service/microservicio2";
import { validarCedula } from "./functions/validarCedula";

function App() {
  const notify = () => toast("Proceso exitoso");
  const notifyError = () => toast.error("Error, introduzca una cedula valida");
  const notifyWarn = (msg) => toast.warn(msg);

  const [cedula, setCedula] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarContribuyente, setMostrarContribuyente] = useState(false);

  const [info, setInfo] = useState({
    contribuyente: "",
    nombre: "",
    puntosMatricula: "",
  });

  function resetearValores() {
    setInfo({
      contribuyente: "",
      nombre: "",
      puntosMatricula: "",
    });
    setMostrarTabla(false);
    setMostrarContribuyente(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetearValores();

    if (!validarCedula(cedula)) {
      notifyError();
      return;
    }

    // 1) Guardar cédula SIEMPRE (no rompas el flujo si falla)
    try {
      const r = await fetch("/.netlify/functions/logCedula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula }),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.log("logCedula fallo:", r.status, t);
      }
    } catch (err) {
      console.log("No se pudo guardar cédula:", err);
    }

    // 2) Microservicio 1 (contribuyente)
    try {
      const respuesta = await microservicio1(cedula + "001");
      setInfo((prev) => ({
        ...prev,
        contribuyente: respuesta?.valida,
      }));
      setMostrarContribuyente(true);
    } catch (err) {
      console.log("microservicio1 error:", err);
      notifyWarn("No se pudo consultar contribuyente (MS1)");
    }

    // 3) Microservicio 2 (puntos/nombre)
    try {
      const respuesta2 = await microservicio2(cedula);
      if (respuesta2?.nombre !== "") {
        setInfo((prev) => ({
          ...prev,
          puntosMatricula: respuesta2?.puntuacion,
          nombre: respuesta2?.nombre,
        }));
        setMostrarTabla(true);
      }
    } catch (err) {
      console.log("microservicio2 error:", err);
      notifyWarn("No se pudo consultar puntaje (MS2)");
    }

    notify();
  };

  return (
    <div className="App">
      <div className="clipPathCircle">
        <div className="LogoImg">
          <img src="/logo.png" alt="" />
        </div>

        <div className="searchContainer">
          <form onSubmit={handleSubmit}>
            <h2>Cédula</h2>
            <input
              placeholder="Ingrese su cedula"
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>

      <div className="boxContainer">
        {mostrarContribuyente ? (
          <div className="ContribuyenteContainer">
            <div>
              <h3>Contribuyente del SRI</h3>
              {info.contribuyente ? "Si" : "No"}
            </div>
            <div>
              <img src="/sri.png" alt="" />
            </div>
          </div>
        ) : (
          <p></p>
        )}

        {mostrarTabla ? (
          <TableInfo puntosMatricula={info.puntosMatricula} nombre={info.nombre} />
        ) : (
          <p></p>
        )}
      </div>

      <img className="ilustrationImg" src="/person.png" alt="" />
    </div>
  );
}

export default App;
