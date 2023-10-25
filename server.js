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
    ]

    )
}
