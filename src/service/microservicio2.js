export function microservicio2(id) {
    const url = `http://localhost:4202/obtenerPuntaje/${id}`;
    return fetch(url, { method: 'GET' }) // Hacer la petición GET
    .then(response => response.json()) // Convertir solo el cuerpo de la respuesta a JSON
    .then(data => {
        return (data);
    })
    .catch(error => {
        console.error(error);
        return '';
    });
}
