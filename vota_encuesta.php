<?php
    header("Content-Type: application/json");
    require_once "dbconnection.php";

    $code = 1;
    $descripcion = "Error en la bbdd";
    if (isset($_POST["idencuesta"]))
    {
        $id = $_POST["idencuesta"];
        $opciones = $_POST["opcionesvotadas"];

        // $datosQuery = GetColumns(count($opciones), $opciones, $id);
        $campos = [];
        $camposstr = "";
        foreach ($opciones as $key => $value) {
            $noOpcion = preg_replace("/[^0-9]/", '', $value);
            $str = "votos".$noOpcion;
            $campos[] = "$str = $str + 1";
        }
        $camposstr = implode(',', $campos);
        $query = "UPDATE encuestas SET $camposstr WHERE encuestaid = ?";
        
        $stmt = $connection->prepare($query);
        if ($stmt)
        {
            $stmt->bind_param('i', $id);
            $result = $stmt->execute();

            if ($result)
            {
                $code = 0;
                $descripcion = "Encuesta votada con éxito";
            }
        }
    }

    $connection->close();

    $respuesta = [
        "code"=>$code,
        "descripcion"=>$descripcion
    ];

    echo json_encode($respuesta);


    // function GetColumns($numopciones, $opciones, $id)
    // {
    //     $votos = [];
    //     foreach ($opciones as $key => $value) {
    //         array_push($votos, explode('_',$value)[1]);
    //     }
    //     $columnas = "";
    //     $params = [];
    //     $types = "";
    //     switch ($numopciones) {
    //         case 3:
    //             $columnas = "votos1 = ?, votos2 = ?, votos3 = ?";
    //             $params = [$votos[0], $votos[1], $votos[2], $id];
    //             $types = "iiii";
    //             break;
    //         case 4:
    //             $columnas = "votos1 = ?, votos2 = ?, votos3 = ?, votos4 = ?";
    //             $params = [$votos[0], $votos[1], $votos[2], $votos[3], $id];
    //             $types = "iiiii";
    //             break;
    //         default:
    //             $columnas = "votos1 = ?, votos2 = ?";
    //             $params = [$votos[0], $votos[1], $id];
    //             $types = "iii";
    //             break;
    //     }

    //     return [$columnas,$params,$types];
    // }
?>