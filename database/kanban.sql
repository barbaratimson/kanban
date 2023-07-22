-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 22 2023 г., 08:35
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `kanban`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cards`
--

CREATE TABLE `cards` (
  `id` int NOT NULL,
  `room_id` bigint NOT NULL,
  `posX` int NOT NULL,
  `posY` int NOT NULL,
  `text` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `cards`
--

INSERT INTO `cards` (`id`, `room_id`, `posX`, `posY`, `text`, `title`) VALUES
(167, 1689802916415, 291, 447, '- Зарплаты хочецаfsdfsde', 'Отдел 1'),
(168, 1689802916415, 211, 113, 'Wtite your text here123', 'Title'),
(169, 1689802916415, 806, 125, 'Wtite your text here', 'Title'),
(170, 1689802916415, -23, 428, 'Wtite your text here', 'Title'),
(171, 1689802916415, 510, 120, 'Wtite your text here', 'Title'),
(172, 1689802916415, 540, 445, 'Wtite your text here', 'Title'),
(173, 1689802916415, 808, 427, 'Wtite your text here', 'Title'),
(174, 1689802920437, 355, 193, 'Wtite your text here', 'Title'),
(175, 1689802916415, 8, 785, 'Wtite your text here', 'Title'),
(177, 1689989508368, 493, 344, 'Каникулы', 'Ураfsdfsdf'),
(178, 1689989508368, 906, 454, 'Wtite your text here', 'Title'),
(179, 1689989508368, 69, 244, 'Wtite your text here', 'Title'),
(180, 1689802916415, -47, 118, 'Wtite your text here', 'Title');

-- --------------------------------------------------------

--
-- Структура таблицы `rooms`
--

CREATE TABLE `rooms` (
  `id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `room_id` bigint NOT NULL,
  `password` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `rooms`
--

INSERT INTO `rooms` (`id`, `owner_user_id`, `room_id`, `password`) VALUES
(27, 6238, 1689802916415, '123'),
(28, 6239, 1689802920437, ''),
(29, 6240, 1689832086558, '123'),
(30, 6241, 1689882016000, '1234'),
(31, 6242, 1689989508368, '123'),
(32, 6243, 1689990746855, '1234');

-- --------------------------------------------------------

--
-- Структура таблицы `tokens`
--

CREATE TABLE `tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `accsess_token` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(6238, '123', '123'),
(6239, '1234', '123'),
(6240, '12345', '123'),
(6241, '123456', '123'),
(6242, 'barbaratimson', '123456'),
(6243, 'SergeySokolov', '123');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT для таблицы `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6244;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
