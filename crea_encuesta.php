<?php
    header("Content-Type: application/json");

    require_once "dbconnection.php";

    $pregunta = "";
    $opciones = [];
    $code = 1;
    $descripcion = "Error al crear la encuesta";
    $encuestaid = null;

    if (isset($_POST["pregunta"]) && strlen($_POST["pregunta"]) > 0 && isset($_POST["opciones"]) && count($_POST["opciones"]) > 1)
    {
        $pregunta = $_POST["pregunta"];
        $opciones = $_POST["opciones"];

        if (count($opciones) > 1)
        {
            $querydata = GetColumns(count($opciones), $pregunta, $opciones);

            $query = "INSERT INTO encuestas ($querydata[0]) VALUES ($querydata[1])";
            
            $stmt = $connection->prepare($query);

            if ($stmt)
            {
                $stmt->bind_param($querydata[3], ...$querydata[2]);
                $result = $stmt->execute();


                if ($result)
                {
                    $encuestaid = $connection->insert_id;
                    $code = 0;
                    $descripcion = "Encuesta creada correctamente";
                }
            }
        }
    }
    else
    {
        $code = 2;
        $descripcion = "Faltan campos por rellenar.";
    }

    $connection->close();

    $resultado = [
        "code"=>$code,
        "descripcion"=>$descripcion,
        "idencuesta"=>$encuestaid
    ];

    echo json_encode($resultado);


    function GetColumns($numopciones, $pregunta, $opciones)
    {
        $columnas = "";
        $values = "";
        $params = [];
        $types = "";
        switch ($numopciones) {
            case 3:
                $columnas = "pregunta, opcion1, opcion2, opcion3";
                $values = "?,?,?,?";
                $params = [$pregunta, $opciones[0], $opciones[1], $opciones[2]];
                $types = "ssss";
                break;
            case 4:
                $columnas = "pregunta, opcion1, opcion2, opcion3, opcion4 ";
                $values = "?,?,?,?,?";
                $params = [$pregunta, $opciones[0], $opciones[1], $opciones[2], $opciones[3]];
                $types = "sssss";
                break;
            default:
                $columnas = "pregunta, opcion1, opcion2";
                $values = "?,?,?";
                $params = [$pregunta, $opciones[0], $opciones[1]];
                $types = "sss";
                break;
        }

        return [$columnas,$values,$params,$types];
    }

?>