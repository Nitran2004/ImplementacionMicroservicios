
export function validarCedula(cedula) {
  // Verificar que la cédula tenga 10 dígitos
  if (cedula.length !== 10) {
    return false;
  }

  // Verificar que la cédula sea numérica
  if (!/^\d+$/.test(cedula)) {
    return false;
  }

  // Verificar el último dígito de la cédula usando el algoritmo de validación
  const digitoVerificador = parseInt(cedula.charAt(9));
  let suma = 0;
  let coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  for (let i = 0; i < coeficientes.length; i++) {
    let producto = parseInt(cedula.charAt(i)) * coeficientes[i];
    suma += producto >= 10 ? producto - 9 : producto;
  }
  
  const digitoCalculado = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  
  return digitoVerificador === digitoCalculado;
}
