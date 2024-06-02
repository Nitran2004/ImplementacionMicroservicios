import React from 'react';

const TableInfo = ({puntosMatricula, nombre }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Puntos de Matrícula</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{nombre}</td>
          <td>{puntosMatricula}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableInfo;
