const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection (
{
    host: "localhost",
    user: "root",
    password: "Hallball",
    database: "staff_db"
},
console.log("Connected to the staff_db database.")
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
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
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
    
}