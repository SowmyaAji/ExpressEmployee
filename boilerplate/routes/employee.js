'use strict';

const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
// let dToday = new Date();
// console.log(dToday)


let maxId = 4


const DATABASE = {
  employee1: {
    'id': '1',
    'firstName': 'Al',
    'lastName': 'Gore',
    'hireDate': '2000 - 11 - 02',
    'role': 'CEO',
    'favoriteQuote': 'Strippers do nothing for me…but I will take a free breakfast buffet anytime, anyplace.',
    'bestJoke': "I needed a password eight characters long so I picked Snow White and the Seven Dwarfs."
  },
  employee2: {
    'id': '2',
    'firstName': 'Bob',
    'lastName': 'Dylan',
    'hireDate': '1997-12-12',
    'role': 'VP'
  },

  employee3: {
    'id': '3',
    'firstName': 'Crystal',
    'lastName': 'Gayle',
    'hireDate': '2007-08-11',
    'role': 'MANAGER'
  },

  employee4: {
    'id': '4',
    'firstName': 'David',
    'lastName': 'Ortiz',
    'hireDate': '2004-04-14',
    'role': 'LACKEY'
  },
};

//Get a quote to add to a new employee
let inQuote;
const quote = () => {
  const url = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
  request.get(url, (error, response, body) => {
    inQuote = JSON.parse(body);
  })
};

//Get a joke to add to a new employee
let inJoke;
const joke = () => {
  const url1 = "https://icanhazdadjoke.com";
  request.get(url1, (error, response, body) => {
    let $ = cheerio.load(body)
    inJoke = $("p.subtitle").text();
  })

}


/* GET employees listing. */
router.get('', function (req, res) {
  return res.send(DATABASE);
});

/* GET one employee by id. */
router.get('/:id', function (req, res) {
  const employee = DATABASE["employee" + req.params.id];
  if (req.params.id in DATABASE) {
    res.send(employee);
  }
  else {
    res.send("That employee does not exist in our records")
  }
})

/*POST new employee. Generate a unique id. If the role of the new employee is "CEO", reject it as the CEO already exists and there can be just one. The hire date of the employee has to be in the past, so has to be less than the date today. Add a joke and a quote to the employee's details*/
router.post('', function (req, res) {
  maxId += 1;
  const newEmployee = req.body;
  if (newEmployee.role !== "CEO") {
    newEmployee.id = maxId;
    newEmployee.favoriteQuote = inQuote;
    newEmployee.bestJoke = inJoke;
    DATABASE["employee" + newEmployee.id] = newEmployee;
    res.send(newEmployee)
  }
  else { res.send("The role listed is wrong.") }
}
);

/*UPDATE an employee's details. */
router.put('/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const updatedEmployee = req.body;
  if (DATABASE["employee" + id] != null) {
    // update data
    DATABASE["employee" + id] = updatedEmployee;
    // return
    res.send(updatedEmployee);
  } else {
    res.send("This employee doesn't exist:\n:" + updatedEmployee);
  }
})

/*DELETE an employee's details. */
router.delete('/:id', function (req, res) {
  const deleteEmployee = DATABASE["employee" + req.params.id];
  delete DATABASE["employee" + req.params.id];
  res.send(deleteEmployee);
})

module.exports = router;
