export function microservicio1(id) {
    const url = `http://localhost:4201/validaRuc/${id}`;
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
