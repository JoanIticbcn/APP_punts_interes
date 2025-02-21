//Definim les classes
class Puntinteres {
    static totalTasques = 0;
    constructor(id, esManual, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio) {
        this.id = id
        this.esManual = esManual
        this.ciutat = ciutat
        this.nom = nom
        this.direccio = direccio
        this.tipus = tipus
        this.latitud = latitud
        this.longitud = longitud
        this.puntuacio = puntuacio
    }
    get id() {
        return this.id
    }
    set id(valor) {
        this.id = valor
    }
    get esManual() {
        return this.esManual
    }
    set esManual(valor) {
        this.esManual = valor
    }
    static obtenirtotalElements() {
        return Puntinteres.totalTasques
    }
}

class Atraccio extends Puntinteres {
    constructor(id, esManual, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, moneda) {
        super(id, esManual, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio)
        this.horaris = horaris
        this.preu = preu
        this.moneda = moneda
    }

    getPreuIva() {
        return this.preu * 0.24;
    }
}

class Museu extends Puntinteres {
    constructor(id, esManual, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, descripcio, moneda) {
        super(id, esManual, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio)
        this.horaris = horaris
        this.preu = preu
        this.descripcio = descripcio
        this.moneda = moneda
    }

    getPreuIva() {
        return this.preu * 0.24
    }
}

class Mapa {
    #map;
    constructor(lat,lon) {
        let mapCenter = [lat, lon]; // Coordinates for Barcelona, Spain  
        let zoomLevel = 13; 
        let map = L.map('map').setView(mapCenter, zoomLevel);
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }); tileLayer.addTo(map);
    }
    mostrarPuntInicial() {

    }
    mostrarPunt() {

    }
    borrarPunt() {

    }
    getPosicioActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                // Coloca un marcador en la ubicación actual del usuario
                L.marker([lat, lng]).addTo(map)
                    .bindPopup("Estás aquí").openPopup();
                // Centra el mapa en la ubicación actual
                map.setView([lat, lng], 13);
            }, function (error) {
                console.error("Error en la geolocalización:", error);
            });
        } else {
            console.error("La geolocalización no está disponible en este navegador.");
        }
    }
}
//APP
const mapa = new Mapa(41.3851,2.1734)
//Menu tipus
let tipusSet = new Set();
const menutipus = document.getElementById("tipus")

//Fitxer CSV
const dragarea = document.getElementById("draganddrop")
dragarea.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/csv') {
            alert("CSV carregat correctament")
        } else {
            alert("NO es un fitxer CSV")
        }
    }
});

//Bandera del pais i latitud i longitud
fetch("https://restcountries.com/v3.1/alpha/ES")
    .then(function (response) {
        return response.json()
    })
    .then(function (dada) {
        console.log(dada)
        document.getElementById("pais").src = dada[0].flags.png
        let latitud = dada[0].latlng[0]
        let longitud = dada[0].latlng[1]
    })