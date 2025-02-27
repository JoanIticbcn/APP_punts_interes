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
        Puntinteres.totalTasques++
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
    map;
    constructor(lat, lon) {
        let mapCenter = [lat, lon]; // Coordinates for Barcelona, Spain  
        let zoomLevel = 13;
        this.map = L.map('map').setView(mapCenter, zoomLevel);
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }); tileLayer.addTo(this.map);
    }
    mostrarPuntInicial() {

    }
    mostrarPunt(latitud, longitud, nombre, direccio, puntuacio) {
        L.marker([latitud, longitud]).addTo(this.map).bindPopup(nombre + " " + direccio + " " + puntuacio).openPopup();
    }
    borrarPunt(latitud,longitud) {
        removeMarker(latitud,longitud,this.mapa)
    }
    getPosicioActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                // Coloca un marcador en la ubicación actual del usuario
                L.marker([lat, lng]).addTo(this.map)
                    .bindPopup("Estás aquí").openPopup();
                // Centra el mapa en la ubicación actual
                this.map.setView([lat, lng], 13);
            }, function (error) {
                console.error("Error en la geolocalización:", error);
            });
        } else {
            console.error("La geolocalización no está disponible en este navegador.");
        }
    }
}

//APP
const mapa = new Mapa(41.3851, 2.1734)
let espai;
let atraccio;
let museu;

//Menu tipus
let tipusSet = new Set();
const menutipus = document.getElementById("tipus")

//Fitxer CSV
const dropzone = document.getElementById("draganddrop")
dropzone.addEventListener("dragover", function (event) {
    event.preventDefault()
    console.log("dragover")
})
dropzone.addEventListener("drop", function (event) {
    event.preventDefault()
    const files = event.dataTransfer.files
    loadfile(files)
})

let tipusespai;
let tipusAtraccio;
let tipusMuseu;

const loadfile = function (files) {
    if (files && files.length > 0) {
        const file = files[0];
        const extensio = file.name.split(".")[1]
        if (extensio.toLowerCase() === "csv") {
            console.log("El fitxer te un format correcte")
            const reader = new FileReader()
            reader.onload = function (event) {
                const text = event.target.result;
                const rows = text.split("\n").map(row => row.split(";"));
                console.log("Parsed CSV:", rows);
                //Menu tipus
                tipusSet.add(rows[1][3])
                tipusSet.add(rows[2][3])
                tipusSet.add(rows[3][3])
                tipusSet.forEach(value => {
                    if (value == "Espai") {
                        tipusespai = document.createElement("option")
                        tipusespai.value = value
                        tipusespai.text = value
                        menutipus.appendChild(tipusespai)
                    }
                    if (value == "Atraccio") {
                        tipusAtraccio = document.createElement("option")
                        tipusAtraccio.value = value
                        tipusAtraccio.text = value
                        menutipus.appendChild(tipusAtraccio)

                    }
                    if (value == "Museu") {
                        tipusMuseu = document.createElement("option")
                        tipusMuseu.value = value
                        tipusMuseu.text = value
                        menutipus.appendChild(tipusMuseu)

                    }
                })
                //Creacio dels objectes
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i][3] == "Espai") {
                        espai = new Puntinteres(1, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11])
                    }
                    if (rows[i][3] == "Atraccio") {
                        atraccio = new Atraccio(1, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11], rows[i][8], rows[i][9], rows[i][12])
                    }
                    if (rows[i][3] == "Museu") {
                        museu = new Museu(1, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11], rows[i][8], rows[i][9], rows[i][10], rows[i][12])
                    }
                }
                console.log(espai, atraccio, museu)
                renderitzarPuntsinteres(espai, atraccio, museu)
            };
            reader.readAsText(file);
        } else {
            alert("El fitxer no te un format correcte")
        }
    }
}

function renderitzarPuntsinteres(espai, atraccio, museu) {
    let total =0;
    const divResult = document.getElementById("llocsinteres")
    divResult.innerHTML = ""
    if (espai) {
        //Espai
        const divEspai = document.createElement("div")
        divEspai.textContent = espai.nom + " | " + espai.ciutat + " | " + "Tipus: " + espai.tipus
        divEspai.className = "espai"
        const botodel = document.createElement("button")
        botodel.textContent = "delete"
        botodel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(null, atraccio, museu)
                mapa.borrarPunt(espai.latitud,espai.longitud)
            }
        })
        divEspai.appendChild(botodel)
        divResult.appendChild(divEspai)
        mapa.mostrarPunt(espai.latitud, espai.longitud, espai.nom, espai.direccio, espai.puntuacio)
        total++
    }

    if (atraccio) {
        //Attracció
        const divAtraccio = document.createElement("div")
        divAtraccio.textContent = atraccio.nom + " | " + atraccio.ciutat + " | " + "Tipus: " + atraccio.tipus + " | " + "Horaris:" + atraccio.horaris + " Preu " + atraccio.preu + "€"
        divAtraccio.className = "atraccio"
        const btndel = document.createElement("button")
        btndel.textContent = "delete"
        btndel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, null, museu)
                mapa.borrarPunt(atraccio.latitud,atraccio.longitud)
            }
        })
        divAtraccio.appendChild(btndel)
        divResult.appendChild(divAtraccio)
        mapa.mostrarPunt(atraccio.latitud, atraccio.longitud, atraccio.nom, atraccio.direccio, atraccio.puntuacio)
        total++
    }
    if (museu) {
        //Museu
        const divMuseu = document.createElement("div")
        divMuseu.textContent = museu.nom + " | " + museu.ciutat + " | " + "Tipus: " + museu.tipus + " | " + "Horaris:" + museu.horaris + " Preu " + museu.preu + "€" + " | Descripcio:" + museu.descripcio
        divMuseu.className = "museu"
        const butondel = document.createElement("button")
        butondel.textContent = "delete"
        butondel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, atraccio, null)
                mapa.borrarPunt(museu.latitud,museu.longitud)
            }
        })
        divMuseu.appendChild(butondel)
        divResult.appendChild(divMuseu)
        mapa.mostrarPunt(museu.latitud, museu.longitud, museu.nom, museu.direccio, museu.puntuacio)
        total++
    }
    document.getElementById("total").textContent = "Numero Total = "+total;
}

//Funcio auxiliar
function removeMarker(lat, lng, map) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            let markerLatLng = layer.getLatLng();
            if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
                map.removeLayer(layer);
            }
        }
    });
}

document.getElementById("Actualitzar").addEventListener("click",function(){
    if(tipusespai.selected){
        renderitzarPuntsinteres(espai,null,null)
    }
    if(tipusAtraccio.selected){
        renderitzarPuntsinteres(null,atraccio,null)
    }
    if(tipusMuseu.selected){
        renderitzarPuntsinteres(null,null,museu)
    }
    if(document.getElementById("tots").selected){
        renderitzarPuntsinteres(espai,atraccio,museu)
    }
})

//Bandera del pais i latitud i longitud
fetch("https://restcountries.com/v3.1/alpha/ES")
    .then(function (response) {
        return response.json()
    })
    .then(function (dada) {
        document.getElementById("pais").src = dada[0].flags.png
        let latitud = dada[0].latlng[0]
        let longitud = dada[0].latlng[1]
    })