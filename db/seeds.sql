INSERT INTO department
(name)
VALUES 
("Sales"), ("Accounting"), ("Marketing"),("Legal");


INSERT INTO role
(title, salary, department_id)
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
("Peter", "Phillips", 4, 2);


CREATE VIEW employee_info AS
(SELECT
role.id AS role_id,
role.title,
role.salary,
department.name AS department_name
FROM role 
JOIN department 
on role.department_id = department.id);

CREATE VIEW employees_with_managers AS
(SELECT emp.id,
emp.first_name,
emp.last_name,
emp.role_id,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee AS manager RIGHT OUTER JOIN employee AS emp ON manager.id = emp.manager_id);