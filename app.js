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
        return this.preu * 1 + this.preu * 0.24;
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
        return this.preu * 1 + this.preu * 0.24;
    }
}
//Classe mapa
class Mapa {
    map;
    constructor(lat, lon) {
        let mapCenter = [lat, lon];
        let zoomLevel = 13;
        this.map = L.map('map').setView(mapCenter, zoomLevel);
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }); tileLayer.addTo(this.map);
    }
    mostrarPuntInicial() {

    }
    mostrarPunt(latitud, longitud, nombre, direccio, puntuacio) {
        L.marker([latitud, longitud]).addTo(this.map).bindPopup(nombre + " " + direccio + " " + puntuacio).openPopup();
    }
    borrarPunt(latitud, longitud) {
        removeMarker(latitud, longitud, this.mapa)
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

//Inicialitzem la app i posem la poscicio actual i definim els 3 espais
const mapa = new Mapa(41.3851, 2.1734)
mapa.getPosicioActual()
let espai;
let atraccio;
let museu;
//Array dels punts d'interés
let puntsinteresArray = new Array()
//Copia de seguretat per a fer els canvis de ordenar i filtrar sense perdre les dades
let copia = new Array()
//Creem el set del Menu tipus
let tipusSet = new Set();
const menutipus = document.getElementById("tipus")

//Fitxer CSV funcions drag and drop
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
//Variables auxiliar del MenuTipus
let tipusespai;
let tipusAtraccio;
let tipusMuseu;
//Carreguem i llegim el fitxer CSV
const loadfile = function (files) {
    if (files && files.length > 0) {
        const file = files[0];
        const extensio = file.name.split(".")[1]
        //Comprovem la extensio abans de contiunar
        if (extensio.toLowerCase() === "csv") {
            console.log("El fitxer te un format correcte")
            const reader = new FileReader()
            reader.onload = function (event) {
                const text = event.target.result;
                const rows = text.split("\n").map(row => row.split(";"));
                console.log("Parsed CSV:", rows);
                //Creem els elements del Menu tipus
                tipusSet.add(rows[1][3])
                tipusSet.add(rows[2][3])
                tipusSet.add(rows[3][3])
                if(rows.length>3){
                    for(let i=0;i<rows.length;i++){
                        tipusSet.add(rows[i][3])
                    }
                }
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
                //Creacio dels objectes espai atraccio i museu i els afegim a l'array
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i][3] == "Espai") {
                        espai = new Puntinteres(i, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11])
                        puntsinteresArray.push(espai)
                        copia.push(espai)
                    }
                    if (rows[i][3] == "Atraccio") {
                        atraccio = new Atraccio(i, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11], rows[i][8], rows[i][9], rows[i][12])
                        puntsinteresArray.push(atraccio)
                        copia.push(atraccio)
                    }
                    if (rows[i][3] == "Museu") {
                        museu = new Museu(i, false, rows[i][2], rows[i][4], rows[i][5], rows[i][3], rows[i][6], rows[i][7], rows[i][11], rows[i][8], rows[i][9], rows[i][10], rows[i][12])
                        puntsinteresArray.push(museu)
                        copia.push(museu);
                    }
                }
                //Renderitzem els objectes en la pagina
                renderitzarPuntsinteres(espai, atraccio, museu)
            };
            reader.readAsText(file);
        } else {
            alert("El fitxer no te un format correcte")
        }
    }
}
//Funció que renderitza els punts d'interés tant a la part lateral com posar els punts al mapa amb la funcio mapa.mostrarpunt
function renderitzarPuntsinteres(espai, atraccio, museu) {
    let total = 0;
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
                mapa.borrarPunt(espai.latitud, espai.longitud)
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
        divAtraccio.textContent = atraccio.nom + " | " + atraccio.ciutat + " | " + "Tipus: " + atraccio.tipus + " | " + "Horaris:" + atraccio.horaris + " Preu " + atraccio.getPreuIva() + "€"
        divAtraccio.className = "atraccio"
        const btndel = document.createElement("button")
        btndel.textContent = "delete"
        btndel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, null, museu)
                mapa.borrarPunt(atraccio.latitud, atraccio.longitud)
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
        divMuseu.textContent = museu.nom + " | " + museu.ciutat + " | " + "Tipus: " + museu.tipus + " | " + "Horaris:" + museu.horaris + " Preu " + museu.getPreuIva() + "€" + " | Descripcio:" + museu.descripcio
        divMuseu.className = "museu"
        const butondel = document.createElement("button")
        butondel.textContent = "delete"
        butondel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, atraccio, null)
                mapa.borrarPunt(museu.latitud, museu.longitud)
            }
        })
        divMuseu.appendChild(butondel)
        divResult.appendChild(divMuseu)
        mapa.mostrarPunt(museu.latitud, museu.longitud, museu.nom, museu.direccio, museu.puntuacio)
        total++
    }
    document.getElementById("total").textContent = "Numero Total = " + total;
    //Si en el CSV i han més de 3 punts es crida la seguent funció
    if (puntsinteresArray.length > 3) {
        renderitzar3omespuntsdinteres()
    }
}

//Funcio per renderitzar més de 3 punts a la vegada
function renderitzar3omespuntsdinteres() {
    const divResult = document.getElementById("llocsinteres")
    let total = 0;
    divResult.innerHTML = ""
    for (let i = 0; i < puntsinteresArray.length; i++) {
        if (puntsinteresArray[i].tipus == "Espai") {
            let espai = puntsinteresArray[i]
            const divEspai = document.createElement("div")
            divEspai.textContent = espai.nom + " | " + espai.ciutat + " | " + "Tipus: " + espai.tipus
            divEspai.className = "espai"
            const botodel = document.createElement("button")
            botodel.textContent = "delete"
            botodel.addEventListener("click", function () {
                let aux = confirm("Estas segur que vols borrar el punt d'interés?")
                if (aux) {
                    puntsinteresArray.splice(i,1)
                    renderitzar3omespuntsdinteres()
                    mapa.borrarPunt(espai.latitud, espai.longitud)
                }
            })
            divEspai.appendChild(botodel)
            divResult.appendChild(divEspai)
            mapa.mostrarPunt(espai.latitud, espai.longitud, espai.nom, espai.direccio, espai.puntuacio)
            total++;
        }
        if (puntsinteresArray[i].tipus == "Atraccio") {
            let atraccio = puntsinteresArray[i]
            const divAtraccio = document.createElement("div")
            divAtraccio.textContent = atraccio.nom + " | " + atraccio.ciutat + " | " + "Tipus: " + atraccio.tipus + " | " + "Horaris:" + atraccio.horaris + " Preu " + atraccio.getPreuIva() + "€"
            divAtraccio.className = "atraccio"
            const btndel = document.createElement("button")
            btndel.textContent = "delete"
            btndel.addEventListener("click", function () {
                let aux = confirm("Estas segur que vols borrar el punt d'interés?")
                if (aux) {
                    puntsinteresArray.splice(i,1)
                    renderitzar3omespuntsdinteres()
                    mapa.borrarPunt(atraccio.latitud, atraccio.longitud)
                }
            })
            divAtraccio.appendChild(btndel)
            divResult.appendChild(divAtraccio)
            mapa.mostrarPunt(atraccio.latitud, atraccio.longitud, atraccio.nom, atraccio.direccio, atraccio.puntuacio)
            total++;
        }
        if (puntsinteresArray[i].tipus == "Museu") {
            let museu = puntsinteresArray[i]
            const divMuseu = document.createElement("div")
            divMuseu.textContent = museu.nom + " | " + museu.ciutat + " | " + "Tipus: " + museu.tipus + " | " + "Horaris:" + museu.horaris + " Preu " + museu.getPreuIva() + "€" + " | Descripcio:" + museu.descripcio
            divMuseu.className = "museu"
            const butondel = document.createElement("button")
            butondel.textContent = "delete"
            butondel.addEventListener("click", function () {
                let aux = confirm("Estas segur que vols borrar el punt d'interés?")
                if (aux) {
                    puntsinteresArray.splice(i,1)
                    renderitzar3omespuntsdinteres()
                    mapa.borrarPunt(museu.latitud, museu.longitud)
                }
            })
            divMuseu.appendChild(butondel)
            divResult.appendChild(divMuseu)
            mapa.mostrarPunt(museu.latitud, museu.longitud, museu.nom, museu.direccio, museu.puntuacio)
            total++;
        }
    }
    document.getElementById("total").textContent = "Numero Total = " + total;
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

//Filtrem per tipus depenen si hi han 3 o més punts de interes
document.getElementById("Actualitzar").addEventListener("click", function () {
    if(puntsinteresArray.length<=3){
        if (tipusespai.selected) {
            renderitzarPuntsinteres(espai, null, null)
        }
        if (tipusAtraccio.selected) {
            renderitzarPuntsinteres(null, atraccio, null)
        }
        if (tipusMuseu.selected) {
            renderitzarPuntsinteres(null, null, museu)
        }
        if (document.getElementById("tots").selected) {
            renderitzarPuntsinteres(espai, atraccio, museu)
        }
    }
    if(puntsinteresArray.length>3){
        if (tipusespai.selected) {
            for(let i=0;i<puntsinteresArray.length;i++){
                if(puntsinteresArray[i].tipus=="Atraccio"){
                    puntsinteresArray.splice(i,1)
                }
                if(puntsinteresArray[i].tipus=="Museu"){
                    puntsinteresArray.splice(i,1)
                }
            }
            renderitzar3omespuntsdinteres()
            puntsinteresArray = copia;        
        }
        if (tipusAtraccio.selected) {
            for(let i=0;i<puntsinteresArray.length;i++){
                if(puntsinteresArray[i].tipus=="Espai"){
                    puntsinteresArray.splice(i,1)
                }
                if(puntsinteresArray[i].tipus=="Museu"){
                    puntsinteresArray.splice(i,1)
                }
            }
            renderitzar3omespuntsdinteres()
            puntsinteresArray = copia;
        }
        if (tipusMuseu.selected) {
            for(let i=0;i<puntsinteresArray.length;i++){
                if(puntsinteresArray[i].tipus=="Atraccio"){
                    puntsinteresArray.splice(i,1)
                }
                if(puntsinteresArray[i].tipus=="Espai"){
                    puntsinteresArray.splice(i,1)
                }
            }
            renderitzar3omespuntsdinteres()
            puntsinteresArray = copia;
        }
        if (document.getElementById("tots").selected) {
            renderitzar3omespuntsdinteres()
        }
    }
})

//Ordenem ascendent o descendent depenent si  hi han 3 o més punt d'interes ho fem amb arrays
document.getElementById("Ordenar").addEventListener("click", function () {
    if(puntsinteresArray.length<=3){
        if (document.getElementById("asc").selected) {
            renderitzarPuntsinteresASC(espai, atraccio, museu)
        }
        if (document.getElementById("desc").selected) {
            renderitzarPuntsinteresDesc(espai, atraccio, museu)
        }
    }
    if(puntsinteresArray.length>3){
        if (document.getElementById("asc").selected) {
            puntsinteresArray.sort((a,b)=>a.nom.localeCompare(b.nom))
            renderitzar3omespuntsdinteres()
            puntsinteresArray = copia;
        }
        if (document.getElementById("desc").selected) {
            puntsinteresArray.sort((a,b)=>b.nom.localeCompare(a.nom))
            renderitzar3omespuntsdinteres()
            puntsinteresArray = copia;
        }
    }
})
//Funcio del boto netejar tota la taula
document.getElementById("Netejar").addEventListener("click", function () {
    document.getElementById("llocsinteres").innerHTML = ""
    document.getElementById("total").textContent = "Numero Total = " + 0;
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
    .catch(function (error) {
        console.log(error)
    })

//Renderitzar en Mode ASc
function renderitzarPuntsinteresASC(espai, atraccio, museu) {
    let total = 0;
    const divResult = document.getElementById("llocsinteres")
    divResult.innerHTML = ""
    if (museu) {
        //Museu
        const divMuseu = document.createElement("div")
        divMuseu.textContent = museu.nom + " | " + museu.ciutat + " | " + "Tipus: " + museu.tipus + " | " + "Horaris:" + museu.horaris + " Preu " + museu.getPreuIva() + "€" + " | Descripcio:" + museu.descripcio
        divMuseu.className = "museu"
        const butondel = document.createElement("button")
        butondel.textContent = "delete"
        butondel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, atraccio, null)
                mapa.borrarPunt(museu.latitud, museu.longitud)
            }
        })
        divMuseu.appendChild(butondel)
        divResult.appendChild(divMuseu)
        mapa.mostrarPunt(museu.latitud, museu.longitud, museu.nom, museu.direccio, museu.puntuacio)
        total++
    }
    if (atraccio) {
        //Attracció
        const divAtraccio = document.createElement("div")
        divAtraccio.textContent = atraccio.nom + " | " + atraccio.ciutat + " | " + "Tipus: " + atraccio.tipus + " | " + "Horaris:" + atraccio.horaris + " Preu " + atraccio.getPreuIva() + "€"
        divAtraccio.className = "atraccio"
        const btndel = document.createElement("button")
        btndel.textContent = "delete"
        btndel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, null, museu)
                mapa.borrarPunt(atraccio.latitud, atraccio.longitud)
            }
        })
        divAtraccio.appendChild(btndel)
        divResult.appendChild(divAtraccio)
        mapa.mostrarPunt(atraccio.latitud, atraccio.longitud, atraccio.nom, atraccio.direccio, atraccio.puntuacio)
        total++
    }
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
                mapa.borrarPunt(espai.latitud, espai.longitud)
            }
        })
        divEspai.appendChild(botodel)
        divResult.appendChild(divEspai)
        mapa.mostrarPunt(espai.latitud, espai.longitud, espai.nom, espai.direccio, espai.puntuacio)
        total++
    }



    document.getElementById("total").textContent = "Numero Total = " + total;
}
//Renderitzar en Mode Desc
function renderitzarPuntsinteresDesc(espai, atraccio, museu) {
    let total = 0;
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
                mapa.borrarPunt(espai.latitud, espai.longitud)
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
        divAtraccio.textContent = atraccio.nom + " | " + atraccio.ciutat + " | " + "Tipus: " + atraccio.tipus + " | " + "Horaris:" + atraccio.horaris + " Preu " + atraccio.getPreuIva() + "€"
        divAtraccio.className = "atraccio"
        const btndel = document.createElement("button")
        btndel.textContent = "delete"
        btndel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, null, museu)
                mapa.borrarPunt(atraccio.latitud, atraccio.longitud)
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
        divMuseu.textContent = museu.nom + " | " + museu.ciutat + " | " + "Tipus: " + museu.tipus + " | " + "Horaris:" + museu.horaris + " Preu " + museu.getPreuIva() + "€" + " | Descripcio:" + museu.descripcio
        divMuseu.className = "museu"
        const butondel = document.createElement("button")
        butondel.textContent = "delete"
        butondel.addEventListener("click", function () {
            let aux = confirm("Estas segur que vols borrar el punt d'interés?")
            if (aux) {
                renderitzarPuntsinteres(espai, atraccio, null)
                mapa.borrarPunt(museu.latitud, museu.longitud)
            }
        })
        divMuseu.appendChild(butondel)
        divResult.appendChild(divMuseu)
        mapa.mostrarPunt(museu.latitud, museu.longitud, museu.nom, museu.direccio, museu.puntuacio)
        total++
    }
    document.getElementById("total").textContent = "Numero Total = " + total;
}