CREATE DATABASE plantsApp;
USE plantsApp;
CREATE TABLE plants (id smallint unsigned not null auto_increment, name varchar(20) not null, plantTime varchar(20) not null, sunlight varchar(20) not null, waterFreq int not null);
INSERT INTO plants (id, name, plantTime, sunlight, waterFreq) VALUES (null, "Lily of the Valley", "Fall", "Partial Shade", 1);
INSERT INTO plants (id, name, plantTime, sunlight, waterFreq) VALUES (null, "Apple Tree", "Spring", "Full Sun", 2);
INSERT INTO plants (id, name, plantTime, sunlight, waterFreq) VALUES (null, "Cactus", "Summer", "Full Sun", 1);
INSERT INTO plants (id, name, plantTime, sunlight, waterFreq) VALUES (null, "Agave", "Summer", "Full Sun", 1);
