const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection (
{
    host: "localhost",
    user: "root",
    password: "Hallball",
    database: "staffdb"
},
console.log("Connected to the staffdb database.")
);

const selection = function () {
    inquirer.prompt ([{
        name: "prompt",
        type: "list",
        message: "Please choose an option.",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role"
        ]
        }
     ])
     .then(function(answers) {
        switch (answers.prompt) {

            case "View all departments":
            viewAllDepts();
            break;

            case "View all roles":
            viewRoles();
            break;

            case "View all employees":
            viewEmployees();
            break;

            case "Add a department":
            addDept();
            break;

            case "Add a role":
            addRole();
            break;

            case "Add an employee":
            addEmployee();
            break;

            case "Update an employee role":
            updateEmployee();
            break;
        }
})
};
selection();

function viewAllDepts () {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        console.table(result);
        selection();
    })
}

function viewRoles () {
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        console.table(result);
        selection();
    })
}

function viewEmployees () {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id,employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
         function (err, result) {
            console.table(result);
            selection();
        })
}

function addDept () {
  inquirer.prompt ([
    {
      type: "input",
      name: "department",
      message: "Enter the name of the department"
    }
  ])
  .then(function(answer) {
    connection.query("INSERT INTO department (name) VALUES (?)", answer.department, (err, results) => {
        if (err) throw err;
        selection();
    })
})
}

function addRole () {
    let deptChoice = [];
    connection.query("SELECT * FROM department", function (err, results) {
        for (let i = 0; i < results.length; i++) {
            deptChoice.push(results[i].name);
        if (err) throw err;
        }
 inquirer.prompt ([
        {
            type: 'input',
            message: "What is the name of the role?",
            name: 'name',
        },
        {
            type: 'input',
            message: "What is the salary of the role?",
            name: 'salary',
        },
        {
            type: 'list',
            message: "What department does the role belong to?",
            name: 'department',
            choices: deptChoice
        }
    ])   
    .then(function(answer) {
        connection.query(`SELECT id FROM department WHERE department.name = ?`, answer.department, (err, results) => {
            let department_id = results[0].id;
        connection.query(`INSERT INTO role(title, salary, department_id)
        VALUES (?,?,?)`, [answer.title, answer.salary, department_id], (err, results) => {
            viewRoles();
        })
        });
    })
})
}

function addEmployee () {
    let roles= [];
    let employees= [];
    connection.query(`SELECT * FROM role`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            roles.push(results[i].title);
        }
        connection.query(`SELECT * FROM employee`, function (err, results) {
            for (let i = 0; i < results.length; i++) {
                let employeeName = `${results[i].first_name} ${results[i].last_name}`
                employees.push(employeeName);
            }
        inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'first_name',
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'last_name',
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'role',
                    choices: roles
                },
                {
                    type: 'list',
                    message: "Does the employee have a manager?",
                    name: 'manager',
                    choices: ["Yes", "No"]
                } ])
        .then(function(answer) {
            let roleName = answer.role;
            let first_name = answer.first_name;
            let last_name = answer.last_name;
            let manager = '';
            let role_id = '';

            connection.query(`SELECT id FROM role WHERE role.title = ?`, answer.role, (err, results) => {
                role_id = results[0].id;
            });
            if (answer.manager === "Yes") {
             inquirer.prompt([
                    {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'manager',
                    choices: employees
                    } ])  
                    .then(function(answer) {
                    connection.query(`SELECT id FROM role WHERE role.title = ?`, roleName, (err, results) => {
                        role_id = results[0].id;
                    })
                    connection.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`, answer.manager.split(" "), (err, results) => {
                        manager = results[0].id;
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES (?,?,?,?)`, [first_name, last_name, role_id, manager], (err, results) => {
                            viewEmployees();
                        })
                    })
                }) 
            } else {
                manager = null;
                connection.query(`SELECT id FROM role WHERE role.title = ?`, roleName, (err, results) => {
                    role_id = results[0].id;
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                    VALUES (?,?,?,?)`, [answer.first_name, answer.last_name, role_id, manager], (err, results) => {
                        viewEmployees();
                    })
                })
            }
        })
    })
})
}
function updateEmployee () {
    let roles= [];
    let employees= [];
    connection.query(`SELECT * FROM role`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            roles.push(results[i].title);
        }
    connection.query(`SELECT * FROM employee`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employees.push(employeeName);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee would you like to update?",
                name: 'employee',
                choices: employees
            },
            {
                type: 'list',
                message: "What is the employee's new role?",
                name: 'role',
                choices: roles
            },
        ]).then((answer) => {

            connection.query(`SELECT id FROM role WHERE role.title = ?;`, answer.role, (err, results) => {
                role_id = results[0].id;
                connection.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`, answer.employee.split(" "), (err, results) => {
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [role_id, results[0].id], (err, results) => {
                        viewEmployees();
                    })
                })

            })
        })
    })
})
}