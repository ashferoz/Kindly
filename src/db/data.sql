-- ROLES table
CREATE TABLE ROLES (
	id 			VARCHAR(50) PRIMARY KEY NOT NULL,
	description VARCHAR(50) NOT NULL
);

INSERT INTO ROLES (id, description)
VALUES ('ADMIN', 'admin'), ('VOLUNTEER', 'volunteer'), ('BENEFICIARY' ,'beneficiary');

SELECT * FROM ROLES;




-- LOCATIONS table
CREATE TABLE LOCATIONS (
id 	VARCHAR(255) PRIMARY KEY,
description	VARCHAR(255) NOT NULL UNIQUE
);



INSERT INTO locations (id, description)
VALUES ('BEDOK', 'Bedok'), ('BISHAN', 'Bishan'), ('PUNGGOL', 'Punggol');

SELECT * FROM LOCATIONS;




-- Users table
CREATE TABLE users(
    uuid            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    firstname       VARCHAR(50) NOT NULL,
    lastname        VARCHAR(50) NOT NULL,
    username        VARCHAR(20) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    bio             TEXT,
    location_id     VARCHAR(255),
    role_id         VARCHAR(50) NOT NULL,
    FOREIGN KEY (location_id) REFERENCES LOCATIONS(id),
    FOREIGN KEY (role_id) REFERENCES ROLES(id)
);


-- Create volunteer
INSERT INTO users (firstname, lastname, username, email, hashed_password, bio, role_id)
VALUES ('Squidward', 'Tentacles', 'squidward', 'st@mail.com', 'password','I do volunteering on the side and help when I can.', 'VOLUNTEER');

-- Create beneficiary
INSERT INTO users (firstname, lastname, username, email, hashed_password, location_id, role_id)
VALUES ('Patrick', 'Star', 'Pat', 'pat@mail.com', 'password', 'BEDOK', 'BENEFICIARY');



SELECT * FROM users;





-- Category table
CREATE TABLE CATEGORY (
id 			VARCHAR(50) PRIMARY KEY,
description	VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO CATEGORY (id, description)
VALUES ('FOOD', 'Food'), ('CLOTHES', 'Clothes'), ('ELECTRONICS', 'Electronics'), ('FURNITURE', 'Furniture');

SELECT * FROM donations_type;




-- Urgencies table
CREATE TABLE URGENCIES (
id			VARCHAR(50) PRIMARY KEY,
description	VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO URGENCIES (id, description)
VALUES	('URGENT', 'Urgent'), ('NOT_URGENT', 'Not Urgent');



-- Status table
CREATE TABLE STATUSES (
id			VARCHAR(50) PRIMARY KEY,
description	VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO STATUSES (id, description)
VALUES	('OPEN', 'Open'), ('ON_GOING', 'On Going'), ('COMPLETE', 'Complete');

SELECT * FROM request_statuses;



-- Request
CREATE TABLE requests (
request_id 			SERIAL PRIMARY KEY,
user_uuid 			UUID NOT NULL,
title 				VARCHAR(50) NOT NULL,
details 			TEXT,
request_category 	VARCHAR(50) NOT NULL,
request_urgency 	VARCHAR(50) NOT NULL,
request_location 	VARCHAR(255) NOT NULL,
request_status 		VARCHAR(50) NOT NULL DEFAULT 'OPEN',
date_created 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_uuid) 		REFERENCES users(uuid),
FOREIGN KEY (request_category) 	REFERENCES category(id),
FOREIGN KEY (request_urgency) 	REFERENCES urgencies(id),
FOREIGN KEY (request_location) 	REFERENCES locations(id),
FOREIGN KEY (request_status) 	REFERENCES statuses(id)
);

INSERT INTO requests (user_uuid, title, details, request_category, request_urgency, request_location)
VALUES ('901f1c72-5625-42a2-bbcc-8fac7cacd699', 'Need work pants.', 'Got a new job.', 'CLOTHES', 'URGENT', 'BEDOK');


SELECT * FROM requests;




-- Connect Volunteer to Beneficiary request
CREATE TABLE connect_users (
connection_id      		SERIAL PRIMARY KEY,
request_status 			VARCHAR(50) NOT NULL DEFAULT 'OPEN',
date_connected     		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
volunteer_uuid     		UUID NOT NULL,
connect_request_id 		INT NOT NULL,
FOREIGN KEY (connect_request_id) 	REFERENCES requests(request_id),
FOREIGN KEY (volunteer_uuid) 		REFERENCES users(uuid)
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
FOREIGN KEY (connection_id) 	REFERENCES connect_users(connection_id)
);



-- Create First Message
DO $$
DECLARE
    new_connection_id INT;
BEGIN
    -- Create a new connection and capture the connection_id
    INSERT INTO connect_users (volunteer_uuid, connect_request_id)
    VALUES ('d87a64f5-ed0c-4400-87a3-52146c13caae', 1)
    RETURNING connection_id INTO new_connection_id;

    -- Insert a new message linked to the created connection
    INSERT INTO messages (content, volunteer_uuid, beneficiary_uuid, connection_id)
    VALUES ('I have extra biscuits. When can I pass it to you?', 'd87a64f5-ed0c-4400-87a3-52146c13caae', 'd8ae9420-cabd-4d3f-b6f3-ff9336646a39', new_connection_id);
END $$;



-- Create another message
SELECT connection_id
FROM connect_users
WHERE volunteer_uuid = 'fe30ea34-c956-43d7-ad10-01ea540489c9'
AND connect_request_id = 1;

INSERT INTO messages (content, volunteer_uuid, beneficiary_uuid, connection_id)
VALUES ('I am Gary, not Patrick...', 'fe30ea34-c956-43d7-ad10-01ea540489c9', 'd8ae9420-cabd-4d3f-b6f3-ff9336646a39', 1);