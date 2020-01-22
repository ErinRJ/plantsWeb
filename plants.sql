CREATE DATABASE plantsApp;
USE plantsApp;
CREATE TABLE plants (id smallint unsigned not null auto_increment, name varchar(20) not null, plantTime varchar(20) not null, sunlight varchar(20) not null, water int not null);
INSERT INTO plants (id, name, plantTime, sunlight, water) VALUES (null, "Lily of the Valley", "Fall", "Partial Shade", 25);
INSERT INTO plants (id, name, plantTime, sunlight, water) VALUES (null, "Apple Tree", "Spring", "Full Sun", 50);
INSERT INTO plants (id, name, plantTime, sunlight, water) VALUES (null, "Cactus", "Summer", "Full Sun", 10);
INSERT INTO plants (id, name, plantTime, sunlight, water) VALUES (null, "Agave", "Summer", "Full Sun", 12);
