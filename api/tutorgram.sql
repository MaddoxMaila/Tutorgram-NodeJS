-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2019 at 10:31 AM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tutorgram`
--

-- --------------------------------------------------------

--
-- Table structure for table `bio`
--

CREATE TABLE `bio` (
  `user_id` int(11) NOT NULL,
  `user_location` text NOT NULL,
  `user_address` text NOT NULL,
  `user_numbers` int(11) NOT NULL,
  `user_certs` text NOT NULL,
  `user_occupation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bio`
--

INSERT INTO `bio` (`user_id`, `user_location`, `user_address`, `user_numbers`, `user_certs`, `user_occupation`) VALUES
(1, '', '', 0, '', ''),
(2, '', '', 0, '', ''),
(3, '', '', 0, '', ''),
(4, '', '', 0, '', ''),
(5, '', '', 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `comment_type` text NOT NULL,
  `comment_text` text NOT NULL,
  `comment_url` text NOT NULL,
  `comment_date` text NOT NULL,
  `comment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`user_id`, `post_id`, `comment_type`, `comment_text`, `comment_url`, `comment_date`, `comment_id`) VALUES
(3, 2, 'image', 'hello', 'http://192.168.43.13:5000/cdn/comments/IMG_20170301_100031.jpg', '2019-11-03 05:21:40.330', 1),
(3, 3, 'text', 'lol bothata keng bra?', '', '2019-11-03 05:23:14.063', 2),
(3, 2, 'image', 'heres your solution!', 'http://192.168.43.13:5000/cdn/comments/IMG_20170228_200514.jpg', '2019-11-03 10:26:10.895', 3),
(3, 9, 'text', 'me also, someone help!', '', '2019-11-03 10:43:03.610', 4),
(2, 3, 'text', 'eix i cant really zoon for yall to see????????', '', '2019-11-04 04:06:34.969', 5),
(2, 3, 'text', 'eix i cant really zoon for yall to see', '', '2019-11-04 04:08:46.264', 6),
(2, 3, 'text', 'eix i cant really zoon for yall to see', '', '2019-11-04 04:10:19.200', 7),
(2, 3, 'text', 'answer!', '', '2019-11-04 04:11:29.024', 8),
(2, 3, 'text', 'answer!', '', '2019-11-04 04:11:29.026', 9),
(2, 7, 'text', 'answer!', '', '2019-11-04 04:11:29.027', 10),
(2, 3, 'text', 'answer!', '', '2019-11-04 04:11:41.032', 11),
(2, 3, 'text', 'answer!', '', '2019-11-04 04:11:41.035', 12),
(2, 7, 'text', 'answer!', '', '2019-11-04 04:11:41.037', 13),
(2, 7, 'text', 'aowa work!! pretty please', '', '2019-11-04 04:12:57.134', 14),
(2, 4, 'text', 'hey', '', '2019-11-04 04:13:37.935', 15),
(2, 7, 'text', 'hey', '', '2019-11-04 04:13:37.930', 16),
(2, 3, 'text', 'hey', '', '2019-11-04 04:13:37.934', 17),
(4, 14, 'text', 'answer!!', '', '2019-11-04 09:47:59.385', 18),
(4, 14, 'text', 'k', '', '2019-11-04 09:49:38.949', 19),
(4, 6, 'text', 'k', '', '2019-11-04 09:49:38.950', 20);

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  `follow_type` text NOT NULL,
  `follow_state` text NOT NULL,
  `follow_date` text NOT NULL,
  `follow_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `follow`
--

INSERT INTO `follow` (`user_one_id`, `user_two_id`, `follow_type`, `follow_state`, `follow_date`, `follow_id`) VALUES
(3, 3, 'follow', 'follow', '2019-10-26 19:21:45.654', 35),
(2, 1, 'follow', 'follow', '2019-10-26 23:26:11.964', 38),
(1, 3, 'follow', 'follow', '2019-11-02 23:03:49.090', 42),
(3, 2, 'follow', 'follow', '2019-11-02 23:11:37.952', 43),
(1, 4, 'follow', 'follow', '2019-11-04 10:36:36.339', 44);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `message_url` text NOT NULL,
  `message_date` text NOT NULL,
  `message_seen` int(11) NOT NULL,
  `message_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`user_one_id`, `user_two_id`, `message_text`, `message_url`, `message_date`, `message_seen`, `message_id`) VALUES
(1, 2, 'Hi, I Require Your Tutoring Services', '', '2019-10-31 14:23:07.637', 0, 12),
(1, 2, 'hello world!', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 14:41:06.072', 0, 13),
(1, 2, 'hey bathong', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 14:50:26.652', 0, 14),
(2, 1, 'hey', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 15:24:25.184', 0, 15),
(2, 1, 'okay', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 15:35:22.799', 0, 16),
(2, 1, 'haha', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 15:36:28.905', 0, 17),
(2, 1, 'laughing', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 15:37:18.639', 0, 18),
(2, 1, 'laughing', 'http://192.168.43.13:5000/cdn/message/', '2019-10-31 15:38:28.881', 0, 19),
(2, 1, 'laughing', 'http://192.168.43.13:5000/cdn/messages/img5.jpg', '2019-10-31 15:39:55.151', 0, 20),
(1, 2, 'hey', 'http://192.168.43.13:5000/cdn/messages/', '2019-11-02 20:43:02.854', 0, 21),
(2, 1, 'hey you too', 'http://192.168.43.13:5000/cdn/messages/', '2019-11-03 19:17:31.806', 0, 22),
(2, 1, 'hey you too', 'http://192.168.43.13:5000/cdn/messages/', '2019-11-03 19:17:52.872', 0, 23),
(2, 1, 'makaka', '', '2019-11-03 19:32:58.574', 0, 24),
(2, 1, 'makaka', '', '2019-11-03 19:38:03.158', 0, 25),
(2, 1, 'makaka', '', '2019-11-03 19:43:27.601', 0, 26),
(2, 1, 'makaka', '', '2019-11-03 19:46:30.528', 0, 27),
(2, 1, 'makaka', '', '2019-11-03 19:50:08.269', 0, 28),
(2, 1, 'hey', 'http://192.168.43.13:5000/cdn/messages/', '2019-11-03 19:59:07.592', 0, 29),
(2, 1, 'hey', '', '2019-11-03 20:00:52.348', 0, 30),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-03 22:38:15.927', 0, 31),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-04 00:39:31.050', 0, 32),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-04 00:41:45.941', 0, 33),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-04 00:48:18.876', 0, 34),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-04 00:53:45.729', 0, 35),
(2, 2, 'Hi, I Require Your Tutoring Services', '', '2019-11-04 00:54:48.057', 0, 36);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `viewer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `notif_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`viewer_id`, `user_id`, `post_id`, `type`, `notif_id`) VALUES
(1, 3, 7, 'like', 1),
(1, 3, 0, 'follow', 4),
(3, 2, 9, 'like', 6),
(3, 2, 10, 'like', 7),
(3, 3, 7, 'like', 10),
(3, 2, 9, 'comment', 11),
(2, 3, 6, 'like', 12),
(2, 1, 1, 'like', 13),
(2, 2, 3, 'like', 14),
(2, 2, 3, 'comment', 15),
(2, 2, 3, 'comment', 16),
(2, 2, 3, 'comment', 17),
(2, 2, 3, 'comment', 18),
(2, 3, 7, 'comment', 19),
(2, 2, 3, 'comment', 20),
(2, 2, 3, 'comment', 21),
(2, 3, 7, 'comment', 22),
(2, 2, 3, 'comment', 23),
(2, 3, 7, 'comment', 24),
(2, 1, 4, 'comment', 25),
(2, 2, 3, 'comment', 26),
(2, 3, 7, 'comment', 27),
(4, 4, 14, 'comment', 28),
(4, 4, 14, 'comment', 29),
(4, 3, 6, 'comment', 30),
(1, 4, 0, 'follow', 31);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `user_id` int(11) NOT NULL,
  `post_type` text NOT NULL,
  `post_text` text NOT NULL,
  `post_url` text NOT NULL,
  `post_date` text NOT NULL,
  `post_time` text NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`user_id`, `post_type`, `post_text`, `post_url`, `post_date`, `post_time`, `post_id`) VALUES
(1, 'image', 'sdfvgybhunjimkl;', 'http://192.168.43.13:5000/cdn/Maddox/IMG_20170301_100046.jpg', '2019-10-24 15:19:05.739', 'hello', 1),
(2, 'image', 'Guys Please Help!! Been On This Question For While And I Cant Seem To Find The Solution', 'http://192.168.43.13:5000/cdn/Kamzen/IMG_20170308_121454.jpg', '2019-10-24 15:20:59.200', 'hello', 2),
(2, 'image', 'hbnm', 'http://192.168.43.13:5000/cdn/Kamzen/IMG_20170308_121212.jpg', '2019-10-24 16:13:31.020', 'hello', 3),
(1, 'image', 'In Need Of A Tutor! Im Struggling With Maths', 'http://192.168.43.13:5000/cdn/Maddox/IMG_20170308_121518.jpg', '2019-10-24 16:32:24.413', 'hello', 4),
(3, 'image', 'Can Someone Please Help Me Find My Error Or Explain  These Lines ????????????????', 'http://192.168.43.13:5000/cdn/Philisiwe/snap18.PNG', '2019-10-24 21:21:32.870', 'hello', 6),
(3, 'image', 'Help!!', 'http://192.168.43.13:5000/cdn/Philisiwe/snip12.PNG', '2019-10-26 19:28:20.647', 'hello', 7),
(2, 'image', 'Solution?', 'http://192.168.43.13:5000/cdn/Kamzen/IMG_20170301_100031.jpg', '2019-10-26 20:55:55.974', 'hello', 8),
(2, 'image', 'Been Stuck Here!', 'http://192.168.43.13:5000/cdn/Kamzen/IMG_20170228_200753.jpg', '2019-10-26 23:52:01.859', 'hello', 9),
(2, 'image', 'Hello', 'http://192.168.43.13:5000/cdn/Kamzen/IMG_20170228_200514.jpg', '2019-10-30 22:22:09.153', 'hello', 10),
(1, 'image', 'My Question', 'http://192.168.43.13:5000/cdn/Maddox/IMG_20170308_121518.jpg', '2019-11-04 04:38:08.882', 'hello', 11),
(1, 'video', 'Upload Video', 'http://192.168.43.13:5000/cdn/Maddox/bat2.mp4', '2019-11-04 04:40:49.651', 'hello', 12),
(4, 'image', 'Hello world', 'http://192.168.43.13:5000/cdn/Kamogelo/IMG_20170228_200514.jpg', '2019-11-04 09:46:31.485', 'hello', 13),
(4, 'image', 'Hi Again', 'http://192.168.43.13:5000/cdn/Kamogelo/IMG_20170228_200753.jpg', '2019-11-04 09:47:21.142', 'hello', 14);

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `like_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`user_id`, `post_id`, `like_id`) VALUES
(1, 1, 9),
(1, 2, 14),
(3, 4, 16),
(3, 3, 18),
(3, 6, 19),
(2, 2, 21),
(2, 7, 22),
(2, 4, 23),
(1, 9, 26),
(1, 3, 27),
(1, 7, 28),
(3, 2, 29),
(3, 9, 30),
(3, 10, 31),
(3, 1, 32),
(3, 7, 33),
(2, 6, 34),
(2, 1, 35);

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `user_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `status` text NOT NULL,
  `req_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`user_id`, `tutor_id`, `status`, `req_id`) VALUES
(1, 2, 'Requested', 2),
(2, 2, 'Requested', 3),
(2, 2, 'Requested', 4),
(2, 2, 'Requested', 5);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `user_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `review_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`user_id`, `comment_id`, `type`, `review_id`) VALUES
(2, 13, 'downvote', 10),
(4, 18, 'downvote', 12);

-- --------------------------------------------------------

--
-- Table structure for table `temp_messages`
--

CREATE TABLE `temp_messages` (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `temp_msg_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `temp_messages`
--

INSERT INTO `temp_messages` (`user_one_id`, `user_two_id`, `message_text`, `temp_msg_id`) VALUES
(2, 1, 'hey', 30),
(2, 2, 'Hi, I Require Your Tutoring Services', 38);

-- --------------------------------------------------------

--
-- Table structure for table `tutor`
--

CREATE TABLE `tutor` (
  `user_id` int(11) NOT NULL,
  `price` text NOT NULL,
  `location` text NOT NULL,
  `subject` text NOT NULL,
  `qualification` text NOT NULL,
  `qualification_file_url` text NOT NULL,
  `rating` text NOT NULL,
  `tutor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tutor`
--

INSERT INTO `tutor` (`user_id`, `price`, `location`, `subject`, `qualification`, `qualification_file_url`, `rating`, `tutor_id`) VALUES
(2, '150', 'Pretoria', 'Maths', 'Matric', 'http://192.168.43.13:5000/cdn/qualifications/IMG_20170228_200514.jpg', '', 1),
(3, '20', 'Gauteng', 'Life Orientation, Arts And Culture', 'Matric', 'http://192.168.43.13:5000/cdn/qualifications/IMG_20170301_100046.jpg', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` text NOT NULL,
  `email` text NOT NULL,
  `account_type` text NOT NULL,
  `account_date` text NOT NULL,
  `user_pass` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `email`, `account_type`, `account_date`, `user_pass`, `user_id`) VALUES
('Maddox', 'maddox@gmail', 'student', '2019-10-22 13:16:13.047', 'madd', 1),
('Kamzen', 'kamz@gmail', 'tutor', '2019-10-22 13:16:42.498', 'kamz', 2),
('Philisiwe', 'phili@gmail', 'tutor', '2019-10-22 13:28:08.082', 'phili', 3),
('Kamogelo', 'kamo@gmail', 'student', '2019-10-22 13:28:36.564', 'kamo', 4),
('Simangaliso', 'sima@gmail', 'student', '2019-11-04 08:55:47.823', 'sima', 5);

-- --------------------------------------------------------

--
-- Table structure for table `user_images`
--

CREATE TABLE `user_images` (
  `user_id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `type` text NOT NULL,
  `image_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_images`
--

INSERT INTO `user_images` (`user_id`, `image_url`, `type`, `image_id`) VALUES
(1, 'http://192.168.43.13:5000/cdn/images/default.png', 'profile', 1),
(1, 'http://192.168.43.13:5000/cdn/images/cover.png', 'cover', 2),
(2, 'http://192.168.43.13:5000/cdn/Kamzen/P1070453.JPG', 'profile', 3),
(2, 'http://192.168.43.13:5000/cdn/Kamzen/cover1.png', 'cover', 4),
(3, 'http://192.168.43.13:5000/cdn/images/default.png', 'profile', 5),
(3, 'http://192.168.43.13:5000/cdn/images/cover.png', 'cover', 6),
(4, 'http://192.168.43.13:5000/cdn/Kamogelo/P1070581.JPG', 'profile', 7),
(4, 'http://192.168.43.13:5000/cdn/Kamogelo/darkknight.jpg', 'cover', 8),
(5, 'http://192.168.43.13:5000/cdn/images/default.png', 'profile', 9),
(5, 'http://192.168.43.13:5000/cdn/images/cover.png', 'cover', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`follow_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notif_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`like_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`req_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `temp_messages`
--
ALTER TABLE `temp_messages`
  ADD PRIMARY KEY (`temp_msg_id`);

--
-- Indexes for table `tutor`
--
ALTER TABLE `tutor`
  ADD PRIMARY KEY (`tutor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_images`
--
ALTER TABLE `user_images`
  ADD PRIMARY KEY (`image_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `follow`
--
ALTER TABLE `follow`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notif_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `req_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `temp_messages`
--
ALTER TABLE `temp_messages`
  MODIFY `temp_msg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT for table `tutor`
--
ALTER TABLE `tutor`
  MODIFY `tutor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user_images`
--
ALTER TABLE `user_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
