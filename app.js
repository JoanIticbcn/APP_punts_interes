class Puntinteres{
    static totalTasques =0;
    constructor(id,esManual,ciutat,nom,direccio,tipus,latitud,longitud,puntuacio){
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
    get id(){
        return this.id
    }
    set id(valor){
        this.id = valor
    }
    get esManual(){
        return this.esManual
    }
    set esManual(valor){
        this.esManual = valor
    }
    static obtenirtotalElements(){
        return Puntinteres.totalTasques
    }
}

class Atraccio extends Puntinteres{
    constructor(id,esManual,ciutat,nom,direccio,tipus,latitud,longitud,puntuacio,horaris,preu){
        super(id,esManual,ciutat,nom,direccio,tipus,latitud,longitud,puntuacio)
        this.horaris = horaris
        this.preu = preu
    }

    getPreuIva(){
        return this.preu * 0,24;
    }
}

class Museu extends Puntinteres{
    constructor(id,esManual,ciutat,nom,direccio,tipus,latitud,longitud,puntuacio,horaris,preu,descripcio){
        super(id,esManual,ciutat,nom,direccio,tipus,latitud,longitud,puntuacio)
        this.horaris = horaris
        this.preu = preu
        this.descripcio = descripcio
    }

    getPreuIva(){
        return this.preu * 0,24
    }
}

class Map{
    constructor(){

    }
    mostrarPuntInicial(){

    }
    mostrarPunt(){
        
    }
    borrarPunt(){
        
    }
    getPosicioActual(){
        
    }
}