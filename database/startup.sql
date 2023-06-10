DROP DATABASE IF EXISTS demoMicroserviceDb;

CREATE DATABASE demoMicroserviceDb;

USE demoMicroserviceDb;

DROP TABLE IF EXISTS dataTable;

CREATE TABLE dataTable ( 
  id INT NOT NULL AUTO_INCREMENT, 
  data LONGTEXT NOT NULL, 
  PRIMARY KEY (id) 
);


INSERT INTO dataTable (data) VALUES('initial data');