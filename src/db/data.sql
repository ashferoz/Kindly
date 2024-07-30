-- ROLES table
CREATE TABLE ROLES (
	id 			VARCHAR(50) PRIMARY KEY NOT NULL
);


-- LOCATIONS table
CREATE TABLE LOCATIONS (
id 	VARCHAR(255) PRIMARY KEY
);



-- Users table
CREATE TABLE users(
    uuid            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name       VARCHAR(50) NOT NULL,
    last_name        VARCHAR(50) NOT NULL,
    username        VARCHAR(20) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password		  VARCHAR(255) NOT NULL,
    bio         	  TEXT,
    role       		  VARCHAR(50) NOT NULL,
    FOREIGN KEY (role) REFERENCES ROLES(id)
);



-- Category table
CREATE TABLE CATEGORIES (
id 			VARCHAR(50) PRIMARY KEY
);



-- Urgencies table
CREATE TABLE URGENCIES (
id			VARCHAR(50) PRIMARY KEY
);




-- Status table
CREATE TABLE STATUSES (
id			VARCHAR(50) PRIMARY KEY
);



-- Request
CREATE TABLE requests (
id 					SERIAL PRIMARY KEY,
beneficiary_uuid 	UUID NOT NULL,
title 				VARCHAR(50) NOT NULL,
details 			TEXT,
category 			VARCHAR(50) NOT NULL,
urgency 			VARCHAR(50) NOT NULL,
location 			VARCHAR(255) NOT NULL,
status 				VARCHAR(50) NOT NULL DEFAULT 'OPEN',
date_created 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (beneficiary_uuid) 	REFERENCES users(uuid),
FOREIGN KEY (category) 			REFERENCES categories(id),
FOREIGN KEY (urgency) 			REFERENCES urgencies(id),
FOREIGN KEY (location) 			REFERENCES locations(id),
FOREIGN KEY (status) 			REFERENCES statuses(id)
);



-- Connect users to request
CREATE TABLE connect_users (
  id			      SERIAL PRIMARY KEY,
  status     		  VARCHAR(50) NOT NULL DEFAULT 'OPEN',
  date_connected      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  volunteer_uuid      UUID NOT NULL,
  request_id		  INT NOT NULL,
  beneficiary_uuid		UUID NOT NULL,
  FOREIGN KEY (request_id) 		REFERENCES requests(id),
  FOREIGN KEY (volunteer_uuid) REFERENCES users(uuid),
  FOREIGN KEY (beneficiary_uuid)	REFERENCES users(uuid),
  CONSTRAINT unique_volunteer_request UNIQUE (volunteer_uuid, request_id)
);




-- Messages
CREATE TABLE messages (
id                	SERIAL PRIMARY KEY,
content           	TEXT,
date_created      	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
volunteer_uuid    	UUID NOT NULL,
beneficiary_uuid  	UUID NOT NULL,
connection_id     	INT NOT NULL,
FOREIGN KEY (volunteer_uuid) 	REFERENCES users(uuid),
FOREIGN KEY (beneficiary_uuid) 	REFERENCES users(uuid),
FOREIGN KEY (connection_id) 	REFERENCES connect_users(id)
);



-- Create another message
SELECT id
FROM connect_users
WHERE volunteer_uuid = 'fe30ea34-c956-43d7-ad10-01ea540489c9'
AND request_id = 1;
