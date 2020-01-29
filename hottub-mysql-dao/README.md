

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `temperature` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  INDEX (`start`),
  PRIMARY KEY (`id`)
);


GRANT ALL PRIVILEGES ON hottub.* TO 'bwa'@'localhost' IDENTIFIED BY 'l1k3h0tw5t3R!';

