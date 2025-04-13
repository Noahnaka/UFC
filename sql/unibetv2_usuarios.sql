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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  PRIMARY KEY (`idUsuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Noah Nakashima','noah@gmail.com','lol','(12)99999-9999','0000-00-00'),(2,'NOAH NAKASHIMA ALMEIDA','noahnakashima@gmail.com','098f6bcd4621d373cade4e832627b4f6','(12)32131-5122','2003-11-12'),(3,'NOAH NAKASHIMA ALMEIDA','noahalmeida007@gmail.com','098f6bcd4621d373cade4e832627b4f6','(31)23123-1231','2003-11-12'),(4,'Micheli D N Almeida','noahnakashima@gmail.com','202cb962ac59075b964b07152d234b70','(12)32131-5122','2003-11-12'),(5,'NOAH NAKASHIMA ALMEIDA','noahalmeida007@gmail.com','202cb962ac59075b964b07152d234b70','(12)22222-2222','2003-11-12'),(6,'Micheli D N Almeida','noahnakashima@gmail.com','202cb962ac59075b964b07152d234b70','(12)32131-5122','1231-11-12'),(7,'NOAH NAKASHIMA ALMEIDA','noahalmeida007@gmail.com','9cdfb439c7876e703e307864c9167a15','(12)32131-5122','1111-11-11'),(8,'NOAH NAKASHIMA ALMEIDA','noahalmeida007@gmail.com','202cb962ac59075b964b07152d234b70','(12)32131-5122','2222-11-11'),(9,'Micheli D N Almeida','noahnakashima@gmail.com','202cb962ac59075b964b07152d234b70','(12)31231-2313','1111-11-11');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
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
