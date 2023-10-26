INSERT INTO department
(name)
VALUES 
("Sales"), ("Accounting"), ("Marketing"),("Legal");


INSERT INTO role
(title,salary, department_id)
VALUES 
("Salesperson", 80000, 1)
("Accountant", 90000, 2)
("Marketing Associate", 75000, 3)
("Lawyer", 95000, 4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
("Arianna", "Potter", 1, 3),
("Adrian", "Smith", 2, 1),
("Sonia", "Carter", 3, 4),
("Peter", "Phillips", 4, null);

