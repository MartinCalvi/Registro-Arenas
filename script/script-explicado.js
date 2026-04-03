/**
 * 1. OBJETO DE GESTIÓN DE DATOS (arenaapi)
 * Centraliza todo lo relacionado con el almacenamiento en el navegador.
 */
const arenaapi = {
    // Definimos la etiqueta o 'llave' con la que guardaremos los datos en el disco
    STORAGE_KEY: 'arena_muestras_data',

    // FUNCIÓN PARA OBTENER DATOS: Lee lo que hay guardado
    getAll: function() {
        // Intenta recuperar el texto guardado bajo nuestra llave
        const data = localStorage.getItem(this.STORAGE_KEY);
        // Si hay texto, lo convierte de JSON a Lista de JS; si no hay nada, devuelve una lista vacía []
        return data ? JSON.parse(data) : [];
    },

    // FUNCIÓN PARA AÑADIR: Recibe una muestra y la suma a la lista
    add: function(sample) {
        // Primero descarga la lista actual
        const data = this.getAll();
        // Agrega el nuevo objeto al final de esa lista
        data.push(sample);
        // Guarda la lista actualizada de nuevo en el disco
        this.save(data);
    },

    // FUNCIÓN PARA ELIMINAR: Borra según la posición (index) en la tabla
    delete: function(index) {
        // Descarga la lista actual
        const data = this.getAll();
        // Verifica que el índice sea válido antes de borrar
        if (index >= 0 && index < data.length) {
            // Elimina 1 elemento en la posición indicada
            data.splice(index, 1);
            // Guarda la lista ya recortada
            this.save(data);
        }
    },

    // FUNCIÓN PARA LIMPIAR TODO: Borra la llave del almacenamiento por completo
    clearAll: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // FUNCIÓN INTERNA PARA GUARDAR: Convierte objetos en texto plano (JSON)
    save: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};

/**
 * 2. LÓGICA PRINCIPAL AL CARGAR LA PÁGINA
 */
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del HTML para poder manipularlos
    const form = document.getElementById('arenaForm'); // El formulario de carga
    const tableBody = document.querySelector('#arenaTable tbody'); // Donde se dibujan las filas
    const btnUpdateMap = document.getElementById('btnUpdateMap'); // Botón de mapa
    const mapFrame = document.getElementById('googleMapFrame'); // El cuadro del mapa
    
    // Referencias a los nuevos botones de acción masiva
    const btnClearAll = document.getElementById('btnClearAll');
    const btnExportCSV = document.getElementById('btnExportCSV');

    // Al abrir la web, dibujamos la tabla con lo que ya esté guardado
    renderTable();

    // EVENTO GUARDAR: Se activa al presionar el botón "Guardar" del formulario
    form.addEventListener('submit', (e) => {
        // Evita que la página se recargue (comportamiento por defecto de los formularios)
        e.preventDefault();
        
        // Atrapamos todos los datos escritos en el formulario
        const formData = new FormData(form);
        
        // Creamos un objeto organizado con esos datos
        const newSample = {
            numeroMuestra: formData.get('numeroMuestra'),
            coleccionista: formData.get('coleccionista'),
            localidad: formData.get('localidad'),
            pais: formData.get('pais'),
            mineralogia: formData.get('mineralogia'),
            paleontologia: formData.get('paleontologia'),
            latitud: formData.get('latitud'),
            longitud: formData.get('longitud')
        };

        // Enviamos el objeto a nuestra "API" de almacenamiento
        arenaapi.add(newSample);
        // Reseteamos las cajitas del formulario para que queden vacías
        form.reset();
        // Volvemos a dibujar la tabla para mostrar el nuevo registro
        renderTable();
    });

    // FUNCIÓN RENDERIZAR: Crea las filas de la tabla visualmente
    function renderTable() {
        // Primero vaciamos la tabla para que no se dupliquen las filas
        tableBody.innerHTML = '';
        // Obtenemos la lista actualizada de muestras
        const samples = arenaapi.getAll();

        // Recorremos cada muestra para crear su fila correspondiente
        samples.forEach((sample, index) => {
            const row = document.createElement('tr'); // Crea el elemento <tr>
            
            // Lista de campos que queremos mostrar en orden
            const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
            
            // Por cada campo, crea una celda <td> con el texto
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = sample[field];
                row.appendChild(cell);
            });

            // Creamos la última celda para los botones de Editar y Eliminar
            const actionsCell = document.createElement('td');
            
            // Configuración del botón Editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'action-btn edit-btn';
            editBtn.onclick = () => editSample(index, sample);

            // Configuración del botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.onclick = () => {
                // Pide confirmación antes de borrar
                if(confirm('¿Eliminar este registro?')) {
                    arenaapi.delete(index);
                    renderTable(); // Refresca la tabla
                }
            };

            // Metemos los botones en la celda y la celda en la fila
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);
            
            // Finalmente, pegamos la fila terminada en el cuerpo de la tabla
            tableBody.appendChild(row);
        });
    }

    // FUNCIÓN EDITAR: Pone los datos de la tabla de vuelta en el formulario
    function editSample(index, sample) {
        const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
        // Recorre los inputs y les asigna el valor de la muestra seleccionada
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) input.value = sample[field];
        });
        // Borra el registro viejo para que al guardar se cree el "nuevo" editado
        arenaapi.delete(index);
        renderTable();
        // Hace un scroll suave hacia arriba para ver el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // EVENTO EXPORTAR CSV: Descarga los datos para Excel
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            const samples = arenaapi.getAll();
            if (samples.length === 0) return alert("No hay datos para exportar.");

            // Títulos de las columnas en el Excel
            const headers = ['Muestra', 'Coleccionista', 'Localidad', 'Pais', 'Mineralogia', 'Paleontologia', 'Latitud', 'Longitud'];
            
            // Convierte cada objeto en una línea de texto separada por comas
            const rows = samples.map(s => [
                s.numeroMuestra, s.coleccionista, s.localidad, s.pais, 
                s.mineralogia, s.paleontologia, s.latitud, s.longitud
            ]);

            // Une todo el contenido en un bloque de texto CSV
            let csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n" 
                + rows.map(e => e.join(",")).join("\n");

            // Crea un link temporal de descarga y lo "cliquea" automáticamente
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "registro_arenas.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // EVENTO LIMPIAR TODO: Borra toda la base de datos
    if (btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres borrar TODOS los datos?')) {
                arenaapi.clearAll();
                renderTable();
            }
        });
    }

    // EVENTO MAPA: Actualiza el mapa según latitud y longitud escritas
    btnUpdateMap.addEventListener('click', () => {
        const lat = document.getElementById('mapLat').value;
        const lng = document.getElementById('mapLng').value;

        if (lat && lng) {
            // Cambia la dirección del cuadro (iframe) para cargar el punto geográfico
            mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        } else {
            alert('Por favor ingrese Latitud y Longitud.');
        }
    });
});