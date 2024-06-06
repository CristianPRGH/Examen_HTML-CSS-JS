<?php
    header("Content-Type: application/json");
    require_once "dbconnection.php";

    $code = 1;
    $descripcion = "Error en la consulta";
    $data = [];

    if (isset($_GET["idencuesta"]) && $_GET["idencuesta"] > 0)
    {
        $id = $_GET["idencuesta"];

        $query = "SELECT *, (votos1+votos2+votos3+votos4) AS total_votos FROM encuestas WHERE encuestaid = ?";
        $stmt = $connection->prepare($query);

        if ($stmt)
        {
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result)
            {
                while ($row = $result->fetch_assoc()) $data[] = $row;
            }

            if (count($data) > 0)
            {
                $code = 0;
                $descripcion = "Consulta exitosa";
            }
            else
            {
                $code = 2;
                $descripcion = "No hay resultados";
            }
        }
    }

    $connection->close();

    $resultado = [
        "datos"=>$data,
        "code"=>$code,
        "descripcion"=>$descripcion
    ];

    echo json_encode($resultado);
?>