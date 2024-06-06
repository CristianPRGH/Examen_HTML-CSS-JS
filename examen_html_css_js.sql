-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2024 a las 17:24:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `examen_html_css_js`
--
CREATE DATABASE IF NOT EXISTS `examen_html_css_js` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `examen_html_css_js`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuestas`
--

DROP TABLE IF EXISTS `encuestas`;
CREATE TABLE `encuestas` (
  `encuestaid` int(11) NOT NULL,
  `pregunta` text NOT NULL,
  `opcion1` varchar(25) NOT NULL,
  `votos1` int(11) DEFAULT 0,
  `opcion2` varchar(25) NOT NULL,
  `votos2` int(11) DEFAULT 0,
  `opcion3` varchar(25) DEFAULT NULL,
  `votos3` int(11) DEFAULT 0,
  `opcion4` varchar(25) DEFAULT NULL,
  `votos4` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD PRIMARY KEY (`encuestaid`),
  ADD UNIQUE KEY `opcion1` (`opcion1`,`opcion2`,`opcion3`,`opcion4`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  MODIFY `encuestaid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
