'use strict';

const express = require('express');
const router = express.Router();
const request = require("request-promise-native");
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

// GET employees listing.
router.get('', function (req, res) {
  return res.send(DATABASE);
});

// GET one employee by id. 
router.get('/:id', function (req, res) {
  const employee = DATABASE["employee" + req.params.id];
  if (req.params.id in DATABASE) {
    res.send(employee);
  }
  else {
    res.send("That employee does not exist in our records")
  }
})

//GET quote from external API and set it as an attribute to the new employee 
const setQuote = (newEmployee, errors) => {
  return request.get("https://xron-swanson-quotes.herokuapp.com/v2/quotes").then(
    resp => {
      newEmployee['quote'] = JSON.parse(resp)[0];
      console.log(newEmployee)
    }
  ).catch((err) => {
    errors.push("Unable to get the quote!")
    console.log(err)
  }
  )
}

//GET joke from external API and set it as an attribute to the new employee 
const setJoke = (newEmployee, errors) => {
  return request.get({ url: "https://icanhazdadjoke.com", headers: { "Accept": "application/json" } }).then(resp => {
    // let $ = cheerio.load(body)
    // newEmployee['joke'] = $("p.subtitle").text();
    newEmployee['joke'] = JSON.parse(resp)['joke'];
    console.log(newEmployee)
  }).catch((err) => {
    errors.push("Unable to get the joke")
    console.log(err)
  }
  )
}

const validatePayload = (employee) => {
  let errors = []
  if (typeof (employee.firstName) !== "string") {
    errors.push("Invalid first name")
  }
  if (typeof (employee.lastName) !== "string") {
    errors.push("Invalid last name")
  }

  if (employee.role === "CEO") {
    errors.push("The role listed is wrong.")
  }
  return errors
}
//POST new employee. 
//Generate a unique id.
//If the role of the new employee is "CEO", reject it as the CEO already exists and there can be just one.
//The hire date of the employee has to be in the past, so has to be less than the date today. 
//Add a joke and a quote from the above functions to the employee's details
router.post('', function (req, res) {
  const newEmployee = req.body;
  let errors = validatePayload(newEmployee)
  if (errors.length > 0) {
    res.status(400).send(errors);
  }
  else {
    maxId += 1;
    newEmployee.id = maxId;
    DATABASE["employee" + newEmployee.id] = newEmployee;
    Promise.all([setQuote(newEmployee, errors), setJoke(newEmployee, errors)]).then(resp => {
      if (errors.length > 0) {
        res.status(400).send(errors);
      }
      else {
        res.send(newEmployee)
      }
    })
  }
});

//UPDATE an employee's details. 
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
