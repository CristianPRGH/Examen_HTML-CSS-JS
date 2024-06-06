document.addEventListener("DOMContentLoaded", () => {
    let addOption = document.getElementById("input-add-option");
    addOption.addEventListener("click", () => {AddNewOption();})

    let enviarEncuesta = document.getElementById("input-enviar");
    enviarEncuesta.addEventListener("click", () => {
        GeneraEncuestaVotar();
    })

    let inputNoUsuarios = document.getElementById("num-usuarios");
    inputNoUsuarios.addEventListener("change", ()=>{
        CreaUsuarios(inputNoUsuarios.value);
    })
})

// AÑADE NUEVA OPCION A LA ENCUESTA 1
function AddNewOption()
{
    let tablaOpciones = document.getElementById("tabla-encuesta_1");
    let numOpciones = tablaOpciones.rows.length;
    let siguienteOpcion = numOpciones + 1;              // Se suma 1 al numero de opciones para incluir la siguiente opcion

    if (numOpciones < 4)
    {
        let newRow = tablaOpciones.insertRow(numOpciones);

        let nuevaOpcion = 
        `
        <div class="input-container">
            <p id="opcion-${siguienteOpcion}" style="display: none;"></p>
            <p class="input-titulo">Opción ${siguienteOpcion} (opcional)</p>
            <input type="text" class="encuesta-opcion input-opcion" id="input-opcion${siguienteOpcion}" size="25" maxlength="25" onkeyup="CuentaLetras(this)" data-letras="letras-opcion-${siguienteOpcion}">
            <p id="letras-opcion-${siguienteOpcion}" class="letras-opcion">0 / 25</p>
        </div>
        `;

        let newCell = newRow.insertCell(0);
        newCell.innerHTML = nuevaOpcion;
    }
    
}

// CUENTA LAS LETRAS ESCRITAS EN LOS INPUT DE LA ENCUESTA 1
function CuentaLetras(input)
{
    let contadorLetras = document.getElementById(input.dataset.letras);
    contadorLetras.textContent = `${input.value.length} / ${input.maxLength}`;
}

// GENERA LA ENCUESTA
async function GeneraEncuestaVotar()
{
    await GuardaEncuesta();
    let data = await ObtieneEncuesta();
    let datos = data.datos[0];

    document.getElementById("encuesta2-pregunta").innerHTML = datos.pregunta;

    let tablasUsuario = Array.from(document.getElementsByClassName("tabla-usuario"));

    tablasUsuario.forEach(tabla => {
        tabla.innerHTML = "";

        let i = 0;
        for (const key in datos) {
            if (key.includes("opcion") && datos[key] != null)
            {
                let row = tabla.insertRow(i);
                let cell = row.insertCell(0);
                let valorOpcion = `<p id="${key}" class="encuesta-opcion encuesta2-opcion pointer no-votada" onclick='VotarOpcion(this)'>${datos[key]}</p>`;
                cell.innerHTML = valorOpcion;
                i++;
            }
        }
        
    });


// FUNCIONAMIENTO POR DEFECTO, VOLVER AQUI SI LO DE LOS USUARIOS NO FUNCIONA
    // let tablaOpcionesVotar = document.getElementById("tabla-encuesta-2");
    // tablaOpcionesVotar.innerHTML = "";
    // let i = 0;
    // for (const key in datos) {
    //     if (key.includes("opcion") && datos[key] != null)
    //     {
    //         let row = tablaOpcionesVotar.insertRow(i);
    //         let cell = row.insertCell(0);
    //         let valorOpcion = `<p id="${key}" class="encuesta-opcion encuesta2-opcion pointer no-votada" onclick='VotarOpcion(this)'>${datos[key]}</p>`;
    //         cell.innerHTML = valorOpcion;
    //         i++;
    //     }
    // }

    // document.getElementById("section1").classList.remove("visible");
    // document.getElementById("section1").classList.add("invisible");
    // document.getElementById("section2").classList.remove("invisible");
    // document.getElementById("section2").classList.add("visible");
}

// FUNCIONALIDAD AL PULSAR LA OPCION A VOTAR EN ENCUESTA 2
function VotarOpcion(opcion)
{
    let element = opcion;
    let parent = null;
    while (true)
    {
        parent = element.parentElement;
        if (parent.nodeName === "TABLE") break;

        element = parent;
    }

    let opcionVotada = parent.getElementsByClassName("votada")[0];
    if (opcionVotada)
    {
        opcionVotada.classList.remove("votada");
        opcionVotada.classList.add("no-votada");
    }
    
    opcion.classList.remove("no-votada");
    opcion.classList.add("votada");
}

// GENERA LA VOTACIÓN DE LA ENCUESTA 2
async function VotarEncuesta()
{
    let id = document.getElementById("id_encuesta").innerHTML;
    let opcionesSeleccionadas = Array.from(document.getElementsByClassName("votada"));
    let formData = new FormData();
    formData.append("idencuesta", id);

    
    opcionesSeleccionadas.forEach(opcion => {
        formData.append("opcionesvotadas[]", `${opcion.id}`);
    });

    let res = await fetch("vota_encuesta.php", {
        method:"post",
        body: formData
    });

    if (res.ok)
    {
        let respuesta = await res.json();
        document.getElementById("vota-encuesta-error").innerHTML = respuesta.descripcion;

        if (respuesta.code == 0)
            MuestraResultados();
    }

    // let opcionSeleccionada = Array.from(document.getElementsByClassName("votada"));
    // if (opcionSeleccionada.length > 0)
    // {
    //     let formData = new FormData();


    //     let id = document.getElementById("id_encuesta").innerHTML;
    //     formData.append("idencuesta", id);
    //     let opciones = Array.from(document.getElementsByClassName("encuesta2-opcion"));
    //     opciones.forEach(opcion => {
    //         if (opcion.classList.contains("votada"))
    //             formData.append("opciones[]", `${opcion.id}_1`);
    //         else
    //             formData.append("opciones[]", `${opcion.id}_0`);
    //     });

    //     let res = await fetch("vota_encuesta.php", {
    //         method:"post",
    //         body: formData
    //     });

    //     if (res.ok)
    //     {
    //         let respuesta = await res.json();
    //         document.getElementById("vota-encuesta-error").innerHTML = respuesta.descripcion;

    //         if (respuesta.code == 0)
    //             MuestraResultados();
    //     }
    // }

    // document.getElementById("section2").classList.remove("visible");
    // document.getElementById("section2").classList.add("invisible");
    // document.getElementById("section3").classList.remove("invisible");
    // document.getElementById("section3").classList.add("visible");
}


// MUESTRA LOS RESULTADOS DE LA VOTACIÓN EN LA ENCUESTA 3
async function MuestraResultados(datos)
{

    let id = document.getElementById("id_encuesta").innerHTML;
    // MUESTRA LOS RESULTADOS DE LA ENCUESTA
    let res = await fetch(`get_encuesta.php?idencuesta=${id}`);
    if (res.ok)
    {
        let respuesta = await res.json();
        let datos = respuesta.datos[0];
        console.log(datos);

        document.getElementById("encuesta3-pregunta").innerHTML = datos.pregunta;

        let tablaResultados = document.getElementById("tabla-encuesta-3");
        tablaResultados.innerHTML = "";

        let i = 0;
        for (const key in datos)
        {
            if (key.includes("opcion") && datos[key] != null)
            {
                let matches = key.match(/(\d+)/);
                let pcjVotos = 0;
                for (const key in datos)
                {
                    if (key === `votos${matches[0]}` && datos[key] != null)
                    {
                        let numVotos = datos[key];
                        pcjVotos = (numVotos / datos.total_votos) * 100;
                    }
                }
                
                
                let row = tablaResultados.insertRow(i);
                let cell = row.insertCell(0);
                let valorOpcion = 
                `
                <div class="encuesta-opcion encuesta3-opcion">
                    <div style="width:${pcjVotos}%;" class="recuento-porcentaje flex-row">
                        <p>${datos[key]}</p>
                        <p>${pcjVotos}%</p>
                    </div>

                </div>
                `;
                cell.innerHTML = valorOpcion;
                i++;
            }
        }
    }
}

// <div class="flex-row">
// <p>${datos[key]}</p>
// <p>${pcjVotos}%</p>
// </div>



// ACCEDE A LA BBDD PARA GUARDAR LA ENCUESTA
async function GuardaEncuesta()
{
    let faltandatos = false;
    let pregunta = document.getElementById("encuesta1-pregunta");
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


// OBTIENE LOS DATOS DE LA ENCUESTA EN CURSO DE LA BBDD
async function ObtieneEncuesta()
{
    let id = document.getElementById("id_encuesta").innerHTML;
    let res = await fetch(`get_encuesta.php?idencuesta=${id}`);
    if (res.ok)
    {
        return data = await res.json();
    }
}



function CreaUsuarios(numUsuarios)
{
    console.log(numUsuarios);
    let section2Usuarios = document.getElementById("usuarios");
    section2Usuarios.innerHTML = ""
    for (let i = 0; i < numUsuarios; i++)
    {
        let nuevoUsuario = 
        `
        <article class="usuario">
        <h3>Usuario ${i+1}</h3>
            <table id="tabla-encuesta-2-usuario${i+1}" class="encuesta-tabla tabla-usuario"></table>
        </article>
        `;

        section2Usuarios.innerHTML += nuevoUsuario;
    }
}