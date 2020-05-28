const inquirer = require("inquirer");

const questions = [
    {
        type: "list",
        name: "todo",
        message: "What do you wanna do?",
        choices: ["Add", "View", "Update", "Delete"]
    },
    {
        "type": "list",
        "name": "role",
        "message": "What do you want to add?",
        choices: ["Add Department", "Add Role", "Add Employee"],
        "when": (answers) => answers.todo === "Add"
    },
    {
        type: 'confirm',
        name: 'continue',
        message: 'You want to add more(just hit enter for YES)?',
        default: true
    }
];

function init(){
    inquirer.prompt(questions).then(answers => {
        if(answers.continue){
            init();
        }else{

            // TODO

        }
    }); 
};

init();