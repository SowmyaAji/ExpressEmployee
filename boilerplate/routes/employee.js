'use strict';

const express = require('express');
const router = express.Router();
const request = require("request-promise-native");
const cheerio = require("cheerio");


const DATABASE = {
  employee1: {
    'id': '1',
    'firstName': 'Al',
    'lastName': 'Gore',
    'hireDate': '2000-10-10',
    'role': 'CEO'
  },

};

let maxId = 1


//GET a listing of all employees.
router.get('', function (req, res) {
  return res.send(DATABASE);
});

// GET a single employee by id. 
router.get('/:id', function (req, res) {
  const employee = DATABASE["employee" + req.params.id];
  if (employee !== undefined) {
    res.send(employee);
  }
  else {
    res.status(404).send("That employee does not exist in our records")
  }
})

//GET quote from external API and set it as an attribute to the new employee 
const setQuote = (newEmployee, errors) => {
  return request.get("https://ron-swanson-quotes.herokuapp.com/v2/quotes").then(
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
  return request.get(
    "https://icanhazdadjoke.com").then(resp => {
      let $ = cheerio.load(resp)
      newEmployee['joke'] = $("p.subtitle").text();
      // newEmployee['joke'] = JSON.parse(resp)['joke'];
      console.log(newEmployee)
    }).catch((err) => {
      errors.push("Unable to get the joke!")
      console.log(err)
    }
    )
}

//Check if the hire date provided for the employee is a valid date
const isValidDate = (dt) => {
  return dt && !isNaN(dt) &&
    Object.prototype.toString.call(dt) === "[object Date]"
}

//Check if thehiredate of an employee is in the correct format  and if it the date is older than the current day
const validateHireDate = (employee) => {
  const hireDate = new Date(employee.hireDate);
  const today = new Date();
  const errors = []
  if (!employee.hireDate.match(/^\d\d\d\d-\d\d-\d\d$/g)) {
    errors.push("Invalid date format, please provide in the YYYY-MM-DD one")
  } else if (!isValidDate(hireDate)) {
    errors.push("Invalid hire date provided")
  }
  else if (hireDate > today) {
    errors.push("Invalid hire date provided")
  }
  return errors;
}

//Identify the CEO
const getCeo = () => {
  for (let value of Object.values(DATABASE)) {
    if (value.role.toUpperCase() === "CEO") {
      return value;
    }
  }
}

//Validate all entries in the post request
//Check if the employee's role is a permitted one
//Check if first name\last name are strings 
const validatePayload = (employee) => {
  let errors = []
  const roles = ['MANAGER', 'VP', 'LACKEY', 'CEO']
  if (typeof (employee.firstName) !== "string") {
    errors.push("Invalid first name")
  }
  if (typeof (employee.lastName) !== "string") {
    errors.push("Invalid last name")
  }
  if (typeof (employee.role) !== "string" || !roles.includes(employee.role.toUpperCase())) {
    errors.push("The role listed is wrong.")
  }
  else {
    if (employee.role.toUpperCase() === "CEO") {
      let ceo = getCeo()
      if (ceo !== undefined && ceo.id !== employee.id) {
        errors.push("Hey, the CEO is " + ceo.firstName + " " + ceo.lastName + "!")
      }

    }
  }
  return errors.concat(validateHireDate(employee))
}
//POST new employee. 
//Generate a unique id. 
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
//Ensure the update also meets all the issues handled by validatePayload
router.put('/:id', function (req, res) {
  const id = req.params.id
  const updatedEmployee = req.body;
  let errors = validatePayload(updatedEmployee)
  if (!errors.length > 0)
  // update data
  {
    DATABASE["employee" + id] = updatedEmployee;
    // return
    res.send(updatedEmployee);
  }
  else {
    res.send("This employee doesn't exist:\n:" + updatedEmployee);
  }
})

/*DELETE an employee's details. */
router.delete('/:id', function (req, res) {
  const id = req.params.id
  const deleteEmployee = DATABASE["employee" + id];
  delete DATABASE[id];
  res.send(deleteEmployee);
})

module.exports = router;
