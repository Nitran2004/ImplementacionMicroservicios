import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import React, { useState } from 'react';
import TableInfo from './component/TableInfo';
import { microservicio1 } from './service/microservicio1';
import { microservicio2 } from './service/microservicio2';
import { validarCedula } from './functions/validarCedula';

function App() {
  //Notificacion de exito
  const notify = () => toast("Proceso exitoso");
  //Notificacion de error
  const notifyError = () => toast.error("Error, introduzca una cedula valida");
  //Estado para guardar la cedula
  const [cedula, setCedula] = useState('');
  //Estado para mostrar la tabla
  const [mostrarTabla, setMostrarTabla] = useState(false);
  //Estado para mostrar el contribuyente
  const [mostrarContribuyente, setMostrarContribuyente] = useState(false);
  //Estado para guardar la informacion del contribuyente
  const [info, setInfo] = useState({
    contribuyente: '',
    nombre: '',
    puntosMatricula: '',
  });

  function resetearValores() {
    setInfo({
      contribuyente: '',
      nombre: '',
      puntosMatricula: '',
    });
    setMostrarTabla(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetearValores();
    if (validarCedula(cedula)) {
      try {
        //Llamada al microservicio 1
        const respuesta = await microservicio1(cedula + '001')
        setInfo(prevState => ({
          ...prevState,
          contribuyente: respuesta?.valida,
        }));
        setMostrarContribuyente(true); // Mostrar la tabla

        //Llamada al microservicio 2
        const respuesta2 = await microservicio2(cedula)
        if (respuesta2?.nombre !== "") {
          setInfo(prevState => ({
            ...prevState,
            puntosMatricula: respuesta2?.puntuacion,
            nombre: respuesta2?.nombre,
          }));

          setMostrarTabla(true); // Mostrar la tabla
        }

        notify(); // Invocar la notificación
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        notifyError(); // Invocar la notificación de error
      }
    } else {
      notifyError(); // Invocar la notificación de error
      setMostrarContribuyente(false); // Mostrar la tabla
    }
  };

  return (
    <div className="App">
      <div class="clipPathCircle">

        <div class="LogoImg">
          <img src="/logo.png" alt=""></img>
        </div>
        <div className='searchContainer'>
          <form onSubmit={handleSubmit}>
            <h2>Cédula</h2>
            <input
              placeholder='Ingrese su cedula'
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
      <div className='boxContainer'>

        {mostrarContribuyente ? (
          <div className='ContribuyenteContainer'>
            <div>
              <h3>Contribuyente del SRI</h3>
              {info.contribuyente ? "Si" : "No"}
            </div>
            <div>
                <img src="/sri.png" alt=""></img>
            </div>
          </div>
        ) : (<p></p>)}
        {mostrarTabla ? (<TableInfo puntosMatricula={info.puntosMatricula} nombre={info.nombre} />) : (<p></p>)}
      </div>
      <img className='ilustrationImg' src="/person.png" alt="" />
    </div>
  );
}

export default App;
