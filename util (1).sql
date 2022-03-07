-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2022 at 05:49 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `util`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `Doctor_id` varchar(100) NOT NULL,
  `Fname` varchar(125) NOT NULL,
  `Mname` varchar(125) NOT NULL,
  `Lname` varchar(125) NOT NULL,
  `Email` varchar(125) DEFAULT NULL,
  `Pass` varchar(100) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Specialization` varchar(40) DEFAULT NULL,
  `Consultation_fee` int(11) DEFAULT NULL,
  `Verified` tinyint(1) DEFAULT 0,
  `Licensed` varchar(50) DEFAULT NULL,
  `Signature` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`Doctor_id`, `Fname`, `Mname`, `Lname`, `Email`, `Pass`, `Gender`, `Specialization`, `Consultation_fee`, `Verified`, `Licensed`, `Signature`) VALUES
('a55ffa84-f41b-4870-bf5c-532ae1a8a80c', 'John', 'M', 'Doe', 'admin', '$2b$10$/0gyySLgStJvsfvfkQOYk.SZCHOr6ZflNIQfhr.ALhT32xUn4FNPy', '', 'Surgeon', NULL, 0, '234123', NULL),
('7aaa0c34-46fa-4a71-89b7-ddff32fdc1dc', '', '', '', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('fc080a4e-e097-47a2-96ae-9d4bf16843cb', '', '', '', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('16c1a592-9ef9-4c93-9650-1d78036dabd8', '', '', '', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('61f61123-0b74-4cb6-848d-f528c1e58632', '', '', '', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('c18d0eea-5e28-4bf3-ba1d-45af4f2228f5', '', '', '', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('39d3a534-0612-4ce9-8097-48dfecaba593', 'Marlo', 'M', 'Aquino', 'marloaquino0213@gmail.com', NULL, NULL, NULL, NULL, 0, NULL, NULL),
('031cf88e-19c9-43ec-8be2-b3dfe07910cc', 'Admin', 'M', 'Admin', 'admin@gmail.com', '$2b$10$NqWz5UKG0ZSgO2f7UeqJkuv35F1rvDIeE2GFep1.yT2RdOX1a9MJC', NULL, NULL, NULL, 0, NULL, NULL),
('227f0686-0f7f-4866-846c-9a2d191f4fdc', 'Marlo', 'M', 'Aquino', 'marloaquino080621@gmail.com', '$2b$10$H.oKSGG0lytvQCJsGvXy5.jOVbuOCdUVq.5xbKpyVmdxmRshEWKQe', NULL, NULL, NULL, 0, NULL, NULL),
('dbe43df9-bd2b-436e-ab5f-27fbc28102ab', 'Liam', 'M', 'Nacion', 'Liam@gmail.com', '$2b$10$f18dAyiGQXCTlqCNUINrqe0y9A2BECNUtGj8uTpcX7h6f9aWMhovC', NULL, NULL, NULL, 0, NULL, NULL),
('bd655a2b-fb8a-4639-b6c7-47f07f34f8e9', 'John', 'M', 'Doe', 'John@gmail.com', '$2b$10$MJ.Iyvt/V58uzKPbJttY5.mYbIjPsMFGMKu3UANrTfrrgi1hf5F92', NULL, NULL, NULL, 0, NULL, NULL),
('47c68c8d-cd2a-4124-a392-e4c7795bb02c', 'Kali', 'L', 'Pein', 'Mark@gmail.com', '$2b$10$t90KYRtNSaJf4WqRWZu/a.8EEGza8URWw.CZKoVfxW1rxRm5qH1Ay', NULL, NULL, NULL, 0, NULL, NULL),
('06c1b21a-d35f-47ca-b275-a44b2af002e4', 'Brians', 'L', 'Pein', 'Brian@gmail.com', '$2b$10$JKeQZ8CdELSU4sojE08TvunRUMbiFlNQp6ME48j4cfslPJUfDSCbq', NULL, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hadmin`
--

CREATE TABLE `hadmin` (
  `Admin_id` varchar(37) NOT NULL,
  `Fname` varchar(125) NOT NULL,
  `Mname` varchar(125) DEFAULT NULL,
  `Lname` varchar(125) NOT NULL,
  `Email` varchar(125) NOT NULL,
  `Pass` varchar(125) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `Item_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `cond` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `lifespan` varchar(100) DEFAULT NULL,
  `Not_pending` tinyint(1) NOT NULL DEFAULT 0,
  `Doctor_id` varchar(37) DEFAULT NULL,
  `Appointment_Time` datetime DEFAULT NULL,
  `Maintenance` tinyint(1) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`Item_id`, `name`, `brand`, `cond`, `price`, `location`, `lifespan`, `Not_pending`, `Doctor_id`, `Appointment_Time`, `Maintenance`, `image`) VALUES
('e2db788c-e29e-4b92-8907-56a5d9e790cd', 'Room1', 'MYSQL', 'Instructor 1', 'Wednesday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('9d59c07b-cffb-4def-b1bc-f96eb69f5a4f', 'Room1', 'Python', 'Instructor 9', 'Thursday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('4edbe5b7-9023-48f8-a2cf-84978e7d7e87', 'Room1', 'Filipino', 'Instructor', 'Saturday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('9a3d5ce4-db33-481a-8fe1-55853bb59dd0', 'Room1', 'C++', 'Instructor 1', 'Sunday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('d012ca64-7a3f-4696-97c9-abde2003ff66', 'Room1', 'Programming', 'Instructor 1', 'Monday', '11:20-11:50', NULL, 0, NULL, NULL, 0, NULL),
('6e18fc73-7d36-4b61-8242-32bbed8f3004', 'Room1', 'SQL', 'good', 'Tuesday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item1`
--

CREATE TABLE `item1` (
  `Item1_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `cond` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `lifespan` varchar(100) DEFAULT NULL,
  `Not_pending` tinyint(1) NOT NULL DEFAULT 0,
  `Doctor_id` varchar(37) DEFAULT NULL,
  `Appointment_Time` datetime DEFAULT NULL,
  `Maintenance` tinyint(1) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `room_id` varchar(37) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item2`
--

CREATE TABLE `item2` (
  `Item2_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `cond` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `lifespan` varchar(100) DEFAULT NULL,
  `Not_pending` tinyint(1) NOT NULL DEFAULT 0,
  `Doctor_id` varchar(37) DEFAULT NULL,
  `Appointment_Time` datetime DEFAULT NULL,
  `Maintenance` tinyint(1) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `item2`
--

INSERT INTO `item2` (`Item2_id`, `name`, `brand`, `cond`, `price`, `location`, `lifespan`, `Not_pending`, `Doctor_id`, `Appointment_Time`, `Maintenance`, `image`) VALUES
('b6fba821-dfbb-409b-91fe-0a39c009dd50', 'Room3', 'Python', 'Instructor', 'Wednesday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('0f221896-f2fa-44f4-8f2e-acf6e16b48f6', 'Room3', 'Programming', 'Instructor', 'Tuesday', '8:00-9:00', NULL, 0, NULL, NULL, 0, NULL),
('885f24c7-c10b-4e78-8068-d1b6cdb96ef0', 'Room3', 'Programming', 'Instructor', 'Monday', '4:30-5:00', NULL, 0, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `room_id` varchar(37) NOT NULL,
  `room_num` varchar(125) NOT NULL,
  `floor` varchar(125) NOT NULL,
  `room_type` varchar(125) NOT NULL,
  `room_person` varchar(125) NOT NULL,
  `Maintenance` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `room_num`, `floor`, `room_type`, `room_person`, `Maintenance`) VALUES
('644643a5-97f9-4cb8-b442-3faf2ca3d2f4', 'Room 2', 'Good', '1st', 'Instructor', 0);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('kaPyyJEDo11849S1EUk8DTkNh5O4E0I0', 1644943753, '{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2022-02-15T16:48:41.210Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"Doctor_id\":\"227f0686-0f7f-4866-846c-9a2d191f4fdc\"}}}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `item1`
--
ALTER TABLE `item1`
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
