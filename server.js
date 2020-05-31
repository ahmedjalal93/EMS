const inquirer = require("inquirer");
const connection = require("./connection.js");

var orm = {
    add:function(table, row, input){
        connection.query("insert into ?? (??) values (?)", [table, row, input], function(err, res) {
            if (err) throw err;
        });
    },
    addMulti:function(table, row, input){
        connection.query("insert into ?? (??) values (?)", [table, row, input], function(err, res) {
            if (err) throw err;
        });
    },
    select:function(table){
        return new Promise((resolve, reject) => {
            connection.query("select * from ??", [table], function(err, res) {
                if (err){
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    selectWhere:function(table, row, query){
        return new Promise((resolve, reject) => {
            connection.query("select * from ?? where ?? = ?", [table, row, query], function(err, res) {
                if (err){
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    updateWhere:function(table, set, value, row, query){
        return new Promise((resolve, reject) => {
            connection.query("update ?? set ?? = ? where ?? = ?", [table, set, value, row, query], function(err, res) {
                if (err){
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    deleteWhere:function(table, row, query){
        return new Promise((resolve, reject) => {
            connection.query("delete from ?? where ?? = ?", [table, row, query], function(err, res) {
                if (err){
                    reject(err);
                }
                resolve(res);
            });
        });
    }
};

async function init(){
    var roleTitle, firstName, lastName;
    var roles = await orm.select("role");
    var managers = await orm.selectWhere("employee", "manager_id", 0);
    managers.push({id:"", first_name:"Null", last_name:""});
    var employees = await orm.select("employee");
    var departments = await orm.select("department");
    inquirer.prompt(
        [{
            type: "list",
            name: "todo",
            message: "What do you wanna do?",
            choices: ["Add", "View", "Update", "Delete"]
        },
        {
            "type": "list",
            "name": "add",
            "message": "What do you want to add?",
            choices: ["Add Department", "Add Role", "Add Employee"],
            "when": (answers) => answers.todo === "Add"
        },
        {
            "type": "input",
            "name": "add_department",
            "message": "What's the name of the department?",
            "when": (answers) => answers.add === "Add Department",
            validate: function(value) {
                if (/[a-zA-Z0-9._]/gi.test(value)) {
                    orm.add("department", "name", value);
                    return true;
                }
                return 'Please enter a valid department';
            }
        },
        {
            "type": "input",
            "name": "add_role_title",
            "message": "What's the role title?",
            "when": (answers) => answers.add === "Add Role",
            validate: function(value) {
                if (/[a-zA-Z0-9._]/gi.test(value)) {
                    return true;
                }
                return 'Please enter a valid role title';
            }
        },
        {
            "type": "input",
            "name": "add_role_salary",
            "message": "What's the role salary?",
            "when": (answers) => answers.add === "Add Role",
            validate: function(value, answers) {
                if (/[0-9]/gi.test(value)) {
                    orm.addMulti("role", ["title", "salary"], [answers.add_role_title, value]);
                    return true; 
                }
                return 'Please enter a valid salary';
            }
        },
        {
            "type": "input",
            "name": "add_employee_first_name",
            "message": "What's the employee first name?",
            "when": (answers) => answers.add === "Add Employee",
            validate: function(value) {
                if (/[a-zA-Z]/gi.test(value)) {
                    return true;
                }
                return 'Please enter a valid first name';
            }
        },
        {
            "type": "input",
            "name": "add_employee_last_name",
            "message": "What's the employee last name?",
            "when": (answers) => answers.add === "Add Employee",
            validate: function(value) {
                if (/[a-zA-Z]/gi.test(value)) {
                    return true;
                }
                return 'Please enter a valid last name';
            }
        },
        {
            "type": "list",
            "name": "add_employee_role",
            "message": "What's the employee role?",
            choices: roles.map((o) => o.id + "-" + o.title),
            "when": (answers) => answers.add === "Add Employee",
        },
        {
            "type": "list",
            "name": "add_employee_manager",
            "message": "Who's the employee manager?",
            choices: managers.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.add === "Add Employee"
        },
        {
            "type": "list",
            "name": "view",
            "message": "What do you want to view?",
            choices: ["View Departments", "View Roles", "View Employees", "View Employees By Manager"],
            "when": (answers) => answers.todo === "View"
        },
        {
            "type": "list",
            "name": "view_by_manager",
            "message": "Who's the employee manager?",
            choices: managers.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.view === "View Employees By Manager"
        },
        {
            "type": "list",
            "name": "update",
            "message": "What do you want to update?",
            choices: ["Update Employee Manager", "Update Employee Role"],
            "when": (answers) => answers.todo === "Update"
        },
        {
            "type": "list",
            "name": "update_manager",
            "message": "Select the employee manager",
            choices: managers.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.update === "Update Employee Manager"
        },
        {
            "type": "list",
            "name": "update_manager_user",
            "message": "Select the employee you want to update",
            choices: employees.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.update === "Update Employee Manager"
        },
        {
            "type": "list",
            "name": "update_role",
            "message": "Select the employee role",
            choices: roles.map((o) => o.id + "-" + o.title),
            "when": (answers) => answers.update === "Update Employee Role"
        },
        {
            "type": "list",
            "name": "update_role_user",
            "message": "Select the employee you want to update",
            choices: employees.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.update === "Update Employee Role"
        },
        {
            "type": "list",
            "name": "delete",
            "message": "What do you want to delete?",
            choices: ["Delete Department", "Delete Role", "Delete Employee"],
            "when": (answers) => answers.todo === "Delete"
        },
        {
            "type": "list",
            "name": "delete_department",
            "message": "Select department you want to delete?",
            choices: departments.map((o) => o.id + "-" + o.name),
            "when": (answers) => answers.delete === "Delete Department"
        },
        {
            "type": "list",
            "name": "delete_role",
            "message": "Select role you want to delete?",
            choices: roles.map((o) => o.id + "-" + o.title),
            "when": (answers) => answers.delete === "Delete Role"
        },
        {
            "type": "list",
            "name": "delete_employee",
            "message": "Select employee you want to delete?",
            choices: employees.map((o) => o.id + "-" + o.first_name + " " + o.last_name),
            "when": (answers) => answers.delete === "Delete Employee"
        }]
    ).then(answers => {
        if(answers.add === "Add Employee"){
            orm.add("employee", ["first_name", "last_name", "role_id", "manager_id"], 
            [answers.add_employee_first_name, answers.add_employee_last_name, answers.add_employee_role.split("-")[0], Number(answers.add_employee_manager.split("-")[0])]);
        }else if(answers.view === "View Departments"){
            orm.select("department").then(function(results){
                console.table(results);
            });
        }else if(answers.view === "View Roles"){
            orm.select("role").then(function(results){
                console.table(results);
            });
        }else if(answers.view === "View Employees"){
            orm.select("employee").then(function(results){
                console.table(results);
            });
        }else if(answers.view === "View Employees By Manager"){
            orm.selectWhere("employee", "manager_id", Number(answers.view_by_manager.split("-")[0])).then(function(results){
                console.table(results);
            });
        }else if(answers.update === "Update Employee Manager"){
            orm.updateWhere("employee", "manager_id", Number(answers.update_manager.split("-")[0]), "id", Number(answers.update_manager_user.split("-")[0])).then(function(results){
                console.table(results);
            });
        }else if(answers.update === "Update Employee Role"){
            orm.updateWhere("employee", "role_id", Number(answers.update_role.split("-")[0]), "id", Number(answers.update_role_user.split("-")[0])).then(function(results){
                console.table(results);
            });
        }else if(answers.delete === "Delete Department"){
            orm.deleteWhere("department", "id", Number(answers.delete_department.split("-")[0])).then(function(results){
                console.table(results);
            });
        }else if(answers.delete === "Delete Role"){
            orm.deleteWhere("role", "id", Number(answers.delete_role.split("-")[0])).then(function(results){
                console.table(results);
            });
        }else if(answers.delete === "Delete Employee"){
            orm.deleteWhere("employee", "id", Number(answers.delete_employee.split("-")[0])).then(function(results){
                console.table(results);
            });
        }
        init();
    }); 
};

init();
