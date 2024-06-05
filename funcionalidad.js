document.addEventListener("DOMContentLoaded", () => {
    let addOption = document.getElementById("input-add-option");
    addOption.addEventListener("click", () => {AddNewOption();})

    let enviarEncuesta = document.getElementById("input-enviar");
    enviarEncuesta.addEventListener("click", () => {
        GeneraEncuestaContestar();
    })
})


function AddNewOption()
{
    let tablaOpciones = document.getElementById("tabla-opciones");
    let numOpciones = tablaOpciones.rows.length - 1;    // Obtiene el el numero de filas de la tabla y le quita 1 para excluir la "pregunta"
    let siguienteOpcion = numOpciones + 1;              // Se suma 1 al numero de opciones para incluir la siguiente opcion

    if (numOpciones < 4)
    {
        let newRow = tablaOpciones.insertRow(siguienteOpcion);

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
    contadorLetras.textContent = `${input.value.length} / ${input.maxLength}`;
}

async function GeneraEncuestaContestar()
{
    await GuardaEncuesta();
    let data = await ObtieneEncuesta();
    console.log(data);

    let datos = data.datos[0];

    document.getElementById("votar-pregunta").innerHTML = datos.pregunta;

    let tablaOpcionesVotar = document.getElementById("votar-opciones");
    tablaOpcionesVotar.innerHTML = "";
    let i = 0;
    for (const key in datos) {
        if (key.includes("opcion") && datos[key] != null)
        {
            let row = tablaOpcionesVotar.insertRow(i);
            let cell = row.insertCell(0);
            let valorOpcion = `<p id="${key}" class="votar-opcion pointer no-votada" onclick='VotarOpcion(this)'>${datos[key]}</p>`;
            cell.innerHTML = valorOpcion;
            i++;
        }
    }
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

async function VotarEncuesta()
{
    let opcionSeleccionada = Array.from(document.getElementsByClassName("votada"));
    if (opcionSeleccionada.length > 0)
    {
        let formData = new FormData();


        let id = document.getElementById("id_encuesta").innerHTML;
        formData.append("idencuesta", id);
        let opciones = Array.from(document.getElementsByClassName("votar-opcion"));
        opciones.forEach(opcion => {
            if (opcion.classList.contains("votada"))
            {
                formData.append("opciones[]", `${opcion.id}_1`);
            }
            else
            {
                formData.append("opciones[]", `${opcion.id}_0`);
            }
        });

        let res = await fetch("vota_encuesta.php", {
            method:"post",
            body: formData
        });
        if (res.ok)
        {
            let respuesta = await res.json();
            document.getElementById("vota-encuesta-error").innerHTML = respuesta.descripcion;
        }
    }
}


async function GuardaEncuesta()
{
    let faltandatos = false;
    let pregunta = document.getElementById("input-pregunta");
    let opciones = Array.from(document.getElementsByClassName("input-opcion"));

    let datosEncuesta = new FormData();
    faltandatos = (pregunta.value == "") ? true : false;
    datosEncuesta.append("pregunta", pregunta.value);
    
    opciones.forEach(opcion => {
        if (opcion.value == "")
        {
            faltandatos = true;
        }
        datosEncuesta.append("opciones[]", opcion.value);
    });

    if (!faltandatos)
    {
        try {
            let res = await fetch("crea_encuesta.php", {
                method:"post",
                body: datosEncuesta
            });
            if (res.ok)
            {
                let respuesta = await res.json();
                document.getElementById("crea-encuesta-error").innerHTML = respuesta.descripcion;
                document.getElementById("id_encuesta").innerHTML = respuesta.idencuesta;
            }

        } catch (error) {
            console.error(error);
        }
    }
    else
    {
        document.getElementById("crea-encuesta-error").innerHTML = "Faltan campos por rellenar";
    }
}

async function ObtieneEncuesta()
{
    let id = document.getElementById("id_encuesta").innerHTML;
    let res = await fetch(`get_encuesta.php?idencuesta=${id}`);
    if (res.ok)
    {
        return data = await res.json();
    }
}