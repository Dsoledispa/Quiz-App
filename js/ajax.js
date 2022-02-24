window.onload = function() {
    openTrivia();

}

function objetoAjax() {
    var xmlhttp = false;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function openTrivia() {
    correctAnswers = 0;
    results = {};
    pubicacion = document.getElementById("preguntas");
    resultados = document.getElementById("resultados");

    var formData = new FormData();

    /* Inicializar un objeto AJAX */
    var ajax = objetoAjax();

    ajax.open("GET", "https://opentdb.com/api.php?amount=10", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);
            results = respuesta.results;
            question();

        }
    }
    ajax.send(formData);
}
var i = 0;

function question() {
    var recarga = "";
    var preguntas = [];
    var pordenadas = [];
    //cuando se llegue a la pregunta 11 que no existe, que escriba fin
    if (i == results.length) {
        recarga += '<h1>Fin</h1>';
    } else {
        recarga += '<h3>' + (i + 1) + ' / ' + results.length + '</h3>';
        recarga += '<h4>' + results[i].question + '</h4>';
        //opciones
        preguntas.push('<button type="button" id="verde" class="opt btn btn-primary btn-lg btn-block" onclick="correcto(); return false;">' + results[i].correct_answer + '</button><br>');
        for (let z = 0; z < results[i].incorrect_answers.length; z++) {
            preguntas.push('<button type="button" id="rojo' + z + '" class="opt btn btn-primary btn-lg btn-block" onclick="incorrecto(' + z + '); return false;">' + results[i].incorrect_answers[z] + '</button><br>');
        }
        //creamos un array de tamaño de la cantidad de preguntas
        //donde nunca se repitan los numeros
        var arr = [];
        while (arr.length < preguntas.length) {
            var r = Math.floor(Math.random() * preguntas.length);
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        //reorganizamos las preguntas para que el orden sea aleatorio
        for (let k = 0; k < arr.length; k++) {
            pordenadas[k] = preguntas[arr[k]]

        }
        // introducimos el nuevo orden de preguntas a la pagina
        for (let j = 0; j < pordenadas.length; j++) {
            recarga += pordenadas[j]

        }
        recarga += '<button type="button" class="btn btn-dark btn-lg btn-block" onclick="question(); return false;">Siguiente pregunta</button>';
    }
    pubicacion.innerHTML = recarga;
    //cada vez que se recargue esta funcion, se suma 1 para leer el siguiente grupo de preguntas
    i++;
}

function correcto() {
    document.getElementById("verde").style.backgroundColor = "#00FF40";
    buttons = document.getElementsByClassName("opt");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    correctAnswers++;
    var recarga2 = "";
    recarga2 += '<h5>Respuestas correctas: ' + correctAnswers + ' de ' + results.length + '</h5>';
    recarga2 += '<button type="button" class="btn btn-dark" onclick="replaced();">Reiniciar</button>';
    resultados.innerHTML = recarga2;
}

function incorrecto(z) {
    //se recoge el id de cada pregunta erronea, para que el fondo se vuelva rojo
    rojo = "rojo" + z;
    document.getElementById(rojo).style.backgroundColor = "#FF0000";
    buttons = document.getElementsByClassName("opt");
    //solo se puede clicar a un boton por cada ronda de preguntas
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    var recarga2 = "";
    recarga2 += '<h5>Respuestas correctas: ' + correctAnswers + ' de ' + results.length + '</h5>';
    recarga2 += '<button type="button" class="btn btn-dark" onclick="replaced();">Reiniciar</button>';
    resultados.innerHTML = recarga2;
}
//boton para recargar la pagina, consiguiendo otra ronda de preguntas
function replaced() {
    location.reload();
}