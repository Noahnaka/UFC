CREATE DATABASE  IF NOT EXISTS `unibetv2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `unibetv2`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: unibetv2
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eventosufc`
--

DROP TABLE IF EXISTS `eventosufc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventosufc` (
  `idUFC` int(11) NOT NULL AUTO_INCREMENT,
  `evento` varchar(45) NOT NULL,
  `local` varchar(45) NOT NULL,
  `lutas` longtext DEFAULT NULL,
  `data` varchar(45) NOT NULL,
  PRIMARY KEY (`idUFC`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventosufc`
--

LOCK TABLES `eventosufc` WRITE;
/*!40000 ALTER TABLE `eventosufc` DISABLE KEYS */;
INSERT INTO `eventosufc` VALUES (1,'UFC Fight Night: Emmett vs. Murphy April 05, ','Las Vegas, Nevada, USA','[{\"id\":1,\"redFighter\":\"Josh Emmett\",\"blueFighter\":\"Lerone Murphy\",\"weightClass\":\"Featherweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":2,\"redFighter\":\"Pat Sabatini\",\"blueFighter\":\"Joanderson Brito\",\"weightClass\":\"Featherweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":3,\"redFighter\":\"Cortavious Romious\",\"blueFighter\":\"ChangHo Lee\",\"weightClass\":\"Bantamweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":4,\"redFighter\":\"Kennedy Nzechukwu\",\"blueFighter\":\"Martin Buday\",\"weightClass\":\"Heavyweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":5,\"redFighter\":\"Brad Tavares\",\"blueFighter\":\"Gerald Meerschaert\",\"weightClass\":\"Middleweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":6,\"redFighter\":\"Torrez Finney\",\"blueFighter\":\"Robert Valentin\",\"weightClass\":\"Middleweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":7,\"redFighter\":\"Ode Osbourne\",\"blueFighter\":\"Luis Gurule\",\"weightClass\":\"Flyweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":8,\"redFighter\":\"Davey Grant\",\"blueFighter\":\"Daniel Santos\",\"weightClass\":\"Bantamweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":9,\"redFighter\":\"Rhys McKee\",\"blueFighter\":\"Daniel Frunza\",\"weightClass\":\"Welterweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":10,\"redFighter\":\"Diana Belbita\",\"blueFighter\":\"Dione Barbosa\",\"weightClass\":\"Women\'s Flyweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":11,\"redFighter\":\"Loma Lookboonmee\",\"blueFighter\":\"Istela Nunes\",\"weightClass\":\"Women\'s Strawweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":12,\"redFighter\":\"Victor Henry\",\"blueFighter\":\"Pedro Falcao\",\"weightClass\":\"Bantamweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"},{\"id\":13,\"redFighter\":\"Vanessa Demopoulos\",\"blueFighter\":\"Talita Alencar\",\"weightClass\":\"Women\'s Strawweight\",\"method\":\"\",\"round\":\"\",\"time\":\"\"}]','April 05, 2025'),(2,'UFC Fight Night: Moreno vs. Erceg March 29, 2','Mexico City, Distrito Federal, Mexico','[{\"id\":1,\"redFighter\":\"Brandon Moreno\",\"blueFighter\":\"Steve Erceg\",\"weightClass\":\"Flyweight\",\"method\":\"U-DEC\",\"round\":\"5\",\"time\":\"5:00\"},{\"id\":2,\"redFighter\":\"Manuel Torres\",\"blueFighter\":\"Drew Dober\",\"weightClass\":\"Lightweight\",\"method\":\"KO/TKO\\n\\n      \\n\\n      \\n        Punches\",\"round\":\"1\",\"time\":\"1:45\"},{\"id\":3,\"redFighter\":\"Edgar Chairez\",\"blueFighter\":\"CJ Vergara\",\"weightClass\":\"Flyweight\",\"method\":\"SUB\\n\\n      \\n\\n      \\n        Rear Naked Choke\",\"round\":\"1\",\"time\":\"2:30\"},{\"id\":4,\"redFighter\":\"Raul Rosas Jr.\",\"blueFighter\":\"Vince Morales\",\"weightClass\":\"Bantamweight\",\"method\":\"U-DEC\",\"round\":\"3\",\"time\":\"5:00\"},{\"id\":5,\"redFighter\":\"David Martinez\",\"blueFighter\":\"Saimon Oliveira\",\"weightClass\":\"Bantamweight\",\"method\":\"KO/TKO\\n\\n      \\n\\n      \\n        Knee\",\"round\":\"1\",\"time\":\"4:38\"},{\"id\":6,\"redFighter\":\"Kevin Borjas\",\"blueFighter\":\"Ronaldo Rodriguez\",\"weightClass\":\"Flyweight\",\"method\":\"U-DEC\",\"round\":\"3\",\"time\":\"5:00\"},{\"id\":7,\"redFighter\":\"Ateba Gautier\",\"blueFighter\":\"Jose Daniel Medina\",\"weightClass\":\"Middleweight\",\"method\":\"KO/TKO\\n\\n      \\n\\n      \\n        Knee\",\"round\":\"1\",\"time\":\"3:32\"},{\"id\":8,\"redFighter\":\"Melquizael Costa\",\"blueFighter\":\"Christian Rodriguez\",\"weightClass\":\"Featherweight\",\"method\":\"U-DEC\",\"round\":\"3\",\"time\":\"5:00\"},{\"id\":9,\"redFighter\":\"Loopy Godinez\",\"blueFighter\":\"Julia Polastri\",\"weightClass\":\"Women\'s Strawweight\",\"method\":\"U-DEC\",\"round\":\"3\",\"time\":\"5:00\"},{\"id\":10,\"redFighter\":\"Rafa Garcia\",\"blueFighter\":\"Vinc Pichel\",\"weightClass\":\"Lightweight\",\"method\":\"U-DEC\",\"round\":\"3\",\"time\":\"5:00\"},{\"id\":11,\"redFighter\":\"Jamall Emmers\",\"blueFighter\":\"Gabriel Miranda\",\"weightClass\":\"Featherweight\",\"method\":\"KO/TKO\\n\\n      \\n\\n      \\n        Punch\",\"round\":\"1\",\"time\":\"4:06\"},{\"id\":12,\"redFighter\":\"MarQuel Mederos\",\"blueFighter\":\"Austin Hubbard\",\"weightClass\":\"Lightweight\",\"method\":\"S-DEC\",\"round\":\"3\",\"time\":\"5:00\"}]','March 29, 2025');
/*!40000 ALTER TABLE `eventosufc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-30 20:27:15
