-- Drop tables if they exist (for reruns)
DROP TABLE IF EXISTS course_assignment;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS courses;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    modulenumber VARCHAR(20) UNIQUE,
    description TEXT
);

-- Create course_assignment table
CREATE TABLE course_assignment (
    user_id INT REFERENCES users(id),
    course_id INT REFERENCES courses(id),
    PRIMARY KEY (user_id, course_id)
);

-- Insert 20 Doctor Who-themed users
INSERT INTO users (firstname, lastname, email, phone) VALUES
('The', 'Doctor', 'doctor@tardis.gal', '0770-0000001'),
('Rose', 'Tyler', 'rose.tyler@unit.uk', '0770-0000002'),
('Martha', 'Jones', 'martha.jones@unit.uk', '0770-0000003'),
('Donna', 'Noble', 'donna.noble@nobletemp.com', '0770-0000004'),
('Amy', 'Pond', 'amy.pond@leadworth.uk', '0770-0000005'),
('Rory', 'Williams', 'rory.williams@unit.uk', '0770-0000006'),
('Clara', 'Oswald', 'clara.oswald@colehill.edu', '0770-0000007'),
('River', 'Song', 'river.song@stormcage.com', '0770-0000008'),
('Jack', 'Harkness', 'jack.harkness@torchwood.org', '0770-0000009'),
('Mickey', 'Smith', 'mickey.smith@alt-universe.net', '0770-0000010'),
('Sarah Jane', 'Smith', 'sarahjane@bbc.co.uk', '0770-0000011'),
('Leela', 'OfTheSevateem', 'leela@galactic.gov', '0770-0000012'),
('Romana', 'Dvoratrelundar', 'romana@time-lords.gal', '0770-0000013'),
('Susan', 'Foreman', 'susan@coalhill.edu', '0770-0000014'),
('Nardole', 'Unknown', 'nardole@vault.keeper', '0770-0000015'),
('Graham', 'O''Brien', 'graham.obrien@sheffield.uk', '0770-0000016'),
('Ryan', 'Sinclair', 'ryan.sinclair@sheffield.uk', '0770-0000017'),
('Yaz', 'Khan', 'yaz.khan@police.uk', '0770-0000018'),
('Wilfred', 'Mott', 'wilf.mott@veterans.uk', '0770-0000019'),
('Missy', 'TheMaster', 'missy@evilplans.org', '0770-0000020');

-- Insert courses
INSERT INTO courses (title, modulenumber, description) VALUES
('Time Travel Ethics', 'M109', 'Study of moral philosophy related to interference in timelines.'),
('Intro to Regeneration', 'T101', 'Biological and psychological theory behind Time Lord regeneration.'),
('TARDIS Engineering', 'TARDIS101', 'Hands-on course in repairing dimensional engines and chameleon circuits.'),
('Temporal Paradoxes', 'M201', 'Classic paradoxes and how to avoid (or exploit) them.'),
('Alien Diplomacy', 'A300', 'Negotiation techniques across galaxies and species.'),
('Cybersecurity for Daleks', 'C404', 'Protecting timelines from extermination attempts.'),
('Sonic Devices Workshop', 'S150', 'Build your own sonic screwdriver. No red settings allowed.');

-- Random course assignments
INSERT INTO course_assignment (user_id, course_id) VALUES
(1, 1), (1, 2), (1, 3), -- The Doctor
(2, 1), (2, 5),
(3, 1), (3, 4),
(4, 4), (4, 6),
(5, 2), (5, 3),
(6, 3), (6, 5),
(7, 1), (7, 2),
(8, 1), (8, 7),
(9, 5), (9, 6),
(10, 6),
(11, 5), (11, 1),
(12, 2),
(13, 2), (13, 4),
(14, 1),
(15, 3),
(16, 5),
(17, 5),
(18, 5), (18, 4),
(19, 1),
(20, 4), (20, 6);

-- Optional: view all course assignments
-- SELECT u.firstname, u.lastname, c.title FROM users u
-- JOIN course_assignment ca ON u.id = ca.user_id
-- JOIN courses c ON ca.course_id = c.id;
