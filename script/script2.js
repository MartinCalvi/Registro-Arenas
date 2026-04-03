// Simulación de una API local y manejo de datos JSON
// Usamos 'arenaapi' en minúsculas para facilitar el uso en consola
const arenaapi = {
    STORAGE_KEY: 'arena_muestras_data',

    // Obtener todos los datos (GET)
    getAll: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Guardar un nuevo registro (POST)
    add: function(sample) {
        const data = this.getAll();
        data.push(sample);
        this.save(data);
    },

    // Eliminar un registro (DELETE)
    delete: function(index) {
        const data = this.getAll();
        if (index >= 0 && index < data.length) {
            data.splice(index, 1);
            this.save(data);
        }
    },

    // Limpiar toda la base de datos
    clearAll: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // Guardar cambios en localStorage
    save: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('arenaForm');
    const tableBody = document.querySelector('#arenaTable tbody');
    const btnUpdateMap = document.getElementById('btnUpdateMap');
    const mapFrame = document.getElementById('googleMapFrame');
    
    // Referencias a los nuevos botones (asegúrate de que los ID coincidan en tu HTML)
    const btnClearAll = document.getElementById('btn_clear_all');
    const btnExportCSV = document.getElementById('btn_export_csv');

    // Cargar datos guardados al iniciar la página
    renderTable();

    // Manejar el evento de guardar (submit)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
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

        arenaapi.add(newSample);
        form.reset();
        renderTable();
    });

    // Función para renderizar la tabla
    /*function renderTable() {
        tableBody.innerHTML = '';
        const samples = arenaapi.getAll();

        samples.forEach((sample, index) => {
            const row = document.createElement('tr');
            const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
            
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = sample[field];
                row.appendChild(cell);
            });

            const actionsCell = document.createElement('td');
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'action-btn edit-btn';
            editBtn.onclick = () => editSample(index, sample);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.onclick = () => {
                if(confirm('¿Eliminar este registro?')) {
                    arenaapi.delete(index);
                    renderTable();
                }
            };

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    }*/

    function renderTable() {
        // 1. Limpiamos la tabla
        tableBody.innerHTML = '';
        
        // 2. Obtenemos los datos
        const samples = arenaapi.getAll();

        // 3. Único ciclo for para recorrer las muestras
        for (let i = 0; i < samples.length; i++) {
            const sample = samples[i];
            
            // Creamos la fila
            const row = document.createElement('tr');

            // Llenamos los datos de la muestra (columnas informativas)
            row.innerHTML = `
                <td>${sample.numeroMuestra}</td>
                <td>${sample.coleccionista}</td>
                <td>${sample.localidad}</td>
                <td>${sample.pais}</td>
                <td>${sample.mineralogia}</td>
                <td>${sample.paleontologia}</td>
                <td>${sample.latitud}</td>
                <td>${sample.longitud}</td>
            `;

            // --- BOTONES DE ACCIÓN (Integrados en el mismo ciclo) ---
            const actionsCell = document.createElement('td');
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'action-btn edit-btn';
            // Al estar dentro del ciclo, 'i' es el índice correcto
            editBtn.onclick = () => editSample(i, sample);

            // Botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.onclick = () => {
                if(confirm('¿Eliminar este registro?')) {
                    arenaapi.delete(i);
                    renderTable(); // Refrescamos la tabla
                }
            };

            // Pegamos los botones en su celda
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            
            // Pegamos la celda de acciones al final de la fila
            row.appendChild(actionsCell);

            // 4. Finalmente, pegamos la fila completa en la tabla
            tableBody.appendChild(row);
        }
    }

        

    function editSample(index, sample) {
        const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) input.value = sample[field];
        });
        arenaapi.delete(index);
        renderTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- NUEVAS FUNCIONES ---

    // Función para Exportar a CSV
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            const samples = arenaapi.getAll();
            if (samples.length === 0) return alert("No hay datos para exportar.");

            const headers = ['Muestra', 'Coleccionista', 'Localidad', 'Pais', 'Mineralogia', 'Paleontologia', 'Latitud', 'Longitud'];
            const rows = samples.map(s => [
                s.numeroMuestra, s.coleccionista, s.localidad, s.pais, 
                s.mineralogia, s.paleontologia, s.latitud, s.longitud
            ]);

            let csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n" 
                + rows.map(e => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "registro_arenas.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Función para Limpiar Todo
    if (btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) {
                arenaapi.clearAll();
                renderTable();
            }
        });
    }

    // Función original del Mapa (Sin cambios)
    btnUpdateMap.addEventListener('click', () => {
        const lat = document.getElementById('mapLat').value;
        const lng = document.getElementById('mapLng').value;

        if (lat && lng) {
            mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        } else {
            alert('Por favor ingrese Latitud y Longitud para ver el mapa.');
        }
    });
});


console.log(
    "%c Coleccion de Arenas - Registro Geológico %c v1.0 %c\nDesarrollado por Martín Javier Calviño \n https://martincalvi.github.io/Coleccion-arenas-2/",
    "color: #1be3c5; background: #222; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 14px;",
    "color: #fff; background: #555; padding: 5px 10px; border-radius: 5px;",
    "color: #888; font-size: 12px; margin-top: 5px;"
);