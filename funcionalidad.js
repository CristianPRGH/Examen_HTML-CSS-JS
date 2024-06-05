document.addEventListener("DOMContentLoaded", () => {
    let addOption = document.getElementById("encuesta-add-opcion");
    addOption.addEventListener("click", () => {AddNewOption();})

    let enviarEncuesta = document.getElementById("input-enviar");
    enviarEncuesta.addEventListener("click", () => {
        GeneraEncuestaContestar();
    })
})


function AddNewOption()
{
    let tablaOpciones = document.getElementById("tabla-opciones");
    let numOpciones = tablaOpciones.rows.length;
    let siguienteOpcion = numOpciones + 1;

    if (numOpciones < 4)
    {

        let newRow = tablaOpciones.insertRow(numOpciones);

        let nuevaOpcion = 
        `
        <div class="input-container">
            <p id="opcion-${siguienteOpcion}" style="display: none;"></p>
            <p class="input-titulo">Opción ${siguienteOpcion} (opcional)</p>
            <input type="text" class="encuesta-input input-opcion" id="input-opcion${siguienteOpcion}" size="25" maxlength="25" onkeyup="CuentaLetras(this)" data-letras="letras-opcion-${siguienteOpcion}">
            <p id="letras-opcion-${siguienteOpcion}" class="letras-opcion">0 / 25</p>
        </div>
        `;

        let newCell = newRow.insertCell(0);
        newCell.innerHTML = nuevaOpcion;
    }
    
}

function CuentaLetras(input)
{
    let contadorLetras = document.getElementById(input.dataset.letras);
    contadorLetras.textContent = `${input.value.length} / 25`;
}

function GeneraEncuestaContestar()
{
    // Obtiene la pregunta creada y la muestra en el módulo de VOTAR
    let pregunta = document.getElementById("input-pregunta").value;
    document.getElementById("votar-pregunta").innerHTML = pregunta;

    // Obtiene las opciones del modulo de crear encuesta
    let opciones = Array.from(document.getElementsByClassName("input-opcion"));
    
    // Obtiene la tabla donde se mostrarán las opciones creadas
    let tablaOpcionesVotar = document.getElementById("votar-opciones");
    tablaOpcionesVotar.innerHTML = "";
    let i = 0;
    opciones.forEach(opcion => {
        let row = tablaOpcionesVotar.insertRow(i);
        let cell = row.insertCell(0);
        let valorOpcion = `<p class="votar-opcion pointer no-votada" onclick='VotarOpcion(this)'>${opcion.value}</p>`;
        cell.innerHTML = valorOpcion;
        i++;
    })
}

function VotarOpcion(opcion)
{
    let opcionVotada = document.getElementsByClassName("votada")[0];
    if (opcionVotada)
    {
        opcionVotada.classList.remove("votada");
        opcionVotada.classList.add("no-votada");
    }
    
    opcion.classList.remove("no-votada");
    opcion.classList.add("votada");
}