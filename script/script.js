
// Simulación de una API local y manejo de datos JSON
/*const ArenaAPI = {
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

    // Cargar datos guardados al iniciar la página
    renderTable();

    // Manejar el evento de guardar (submit)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        
        // Crear objeto JSON con los datos
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

        // Guardar en la "API" local
        ArenaAPI.add(newSample);
        
        // Limpiar el formulario después de guardar
        form.reset();
        renderTable();
    });

    // Función para renderizar la tabla desde los datos guardados (JSON)
    function renderTable() {
        tableBody.innerHTML = '';
        const samples = ArenaAPI.getAll();

        samples.forEach((sample, index) => {
            const row = document.createElement('tr');
            
            // Campos a mostrar
            const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
            
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = sample[field];
                row.appendChild(cell);
            });

            // Botones de acción
            const actionsCell = document.createElement('td');
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'action-btn edit-btn';
            editBtn.onclick = () => editSample(index, sample);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.onclick = () => {
                ArenaAPI.delete(index);
                renderTable();
            };

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    }

    // Función para editar: carga datos al form y borra de la lista temporalmente
    function editSample(index, sample) {
        const fields = ['numeroMuestra', 'coleccionista', 'localidad', 'pais', 'mineralogia', 'paleontologia', 'latitud', 'longitud'];
        
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) input.value = sample[field];
        });

        // Al editar, sacamos el elemento de la lista para que el usuario lo "vuelva a guardar"
        ArenaAPI.delete(index);
        renderTable();
    }

    // Función para actualizar el iframe de Google Maps
    btnUpdateMap.addEventListener('click', () => {
        const lat = document.getElementById('mapLat').value;
        const lng = document.getElementById('mapLng').value;

        if (lat && lng) {
            mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        } else {
            alert('Por favor ingrese Latitud y Longitud para ver el mapa.');
        }
    });
});*/
