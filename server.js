const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection (
{
    host: "localhost",
    user: "root",
    password: "Hallball",
    database: "employees_db"
},
console.log("Connected to the employees_db database.")
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

            case "View all departments";
            viewAllDepts();
            break;

            case "View all roles";
            viewRoles();
            break;

            case "View all employees";
            viewEmployees();
            break;

            case "Add a department";
            addDept();
            break;

            case "Add a role";
            addRole();
            break;

            case "Add an employee";
            addEmployee();
            break;

            case "Update an employee role";
            updateEmployee();
            break;
        }
})
};
selection();

function viewAllDepts () {
    connection.query(`SELECT * FROM department`, function (err, result) {
        if (err) throw err;
        console.table(result);
        selection();
    })
}

function viewRoles () {
    connection.query(`SELECT * FROM role`, function (err, result) {
        if (err) throw err;
        console.table(result);
        selection();
    })
}


}