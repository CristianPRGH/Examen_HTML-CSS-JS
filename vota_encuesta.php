<?php
    header("Content-Type: application/json");
    require_once "dbconnection.php";

    $code = 1;
    $descripcion = "Error en la bbdd";
    if (isset($_POST["idencuesta"]))
    {
        $id = $_POST["idencuesta"];
        $opciones = $_POST["opciones"];

        $datosQuery = GetColumns(count($opciones), $opciones, $id);

        $query = "UPDATE encuestas SET $datosQuery[0] WHERE encuestaid = ?";
        
        $stmt = $connection->prepare($query);
        if ($stmt)
        {
            $stmt->bind_param($datosQuery[2], ...$datosQuery[1]);
            $result = $stmt->execute();

            if ($result)
            {
                $code = 0;
                $descripcion = "Encuesta votada con éxito";
            }
        }
    }

    $respuesta = [
        "code"=>$code,
        "descripcion"=>$descripcion
    ];

    echo json_encode($respuesta);


    function GetColumns($numopciones, $opciones, $id)
    {
        $votos = [];
        foreach ($opciones as $key => $value) {
            array_push($votos, explode('_',$value)[1]);
        }
        $columnas = "";
        $params = [];
        $types = "";
        switch ($numopciones) {
            case 3:
                $columnas = "votos1 = ?, votos2 = ?, votos3 = ?";
                $params = [$votos[0], $votos[1], $votos[2], $id];
                $types = "iiii";
                break;
            case 4:
                $columnas = "votos1 = ?, votos2 = ?, votos3 = ?, votos4 = ?";
                $params = [$votos[0], $votos[1], $votos[2], $votos[3], $id];
                $types = "iiiii";
                break;
            default:
                $columnas = "votos1 = ?, votos2 = ?";
                $params = [$votos[0], $votos[1], $id];
                $types = "iii";
                break;
        }

        return [$columnas,$params,$types];
    }
?>