'use strict';

const express = require('express');
const router = express.Router();
const request = require("request-promise-native");
const cheerio = require("cheerio");

const DATABASE = {};
let maxId = 0

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
  let date1 = new Date(dt)
  let date2 = date1.toISOString()
  let date3 = date2.slice(0, 10)
  return (dt === date3)
}

//Check if the hiredate of an employee is in the correct format  and if the date is older than the current day
const validateHireDate = (employee) => {
  const hireDate = new Date(employee.hireDate);
  const today = new Date();
  const errors = []
  if (!employee.hireDate.match(/^\d\d\d\d-\d\d-\d\d$/g)) {
    errors.push("Invalid date format, please provide in the YYYY-MM-DD one")
  } else if (!isValidDate(employee.hireDate)) {
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
const validatePayload = (employee) => {
  let errors = []
  //Check if the employee's role is a permitted one
  const roles = ['MANAGER', 'VP', 'LACKEY', 'CEO']
  //Check if first name\last name are strings 
  if (typeof (employee.firstName) !== "string") {
    errors.push("Invalid first name")
  }
  if (typeof (employee.lastName) !== "string") {
    errors.push("Invalid last name")
  }
  if (typeof (employee.role) !== "string" || !roles.includes(employee.role.toUpperCase())) {
    errors.push("The role listed is wrong.")
  }
  //Check if new employee is claiming to be CEO
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

//CREATE new employee.  
router.post('', function (req, res) {
  const newEmployee = req.body;
  let errors = validatePayload(newEmployee)
  if (errors.length > 0) {
    res.status(400).send(errors);
  }
  else {
    //Generate a unique id.
    maxId += 1;
    newEmployee.id = maxId;
    DATABASE["employee" + newEmployee.id] = newEmployee;
    //Add a joke and a quote from the above functions to the employee's details
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
  const id = req.params.id
  const currentEmployee = DATABASE["employee" + id]
  const updatedEmployee = req.body;
  //Ensure the update also meets all the issues handled by validatePayload
  let errors = validatePayload(updatedEmployee)
  if (!errors.length > 0)
  //Update data and ensure that only the editable fields are updated, not the id, joke or quote
  {
    const revisedEmployee = Object.assign({}, currentEmployee, updatedEmployee);
    // return
    res.send(revisedEmployee);
  }
  else {
    res.send("This employee doesn't exist:\n:" + updatedEmployee);
  }
})

//DELETE an employee's details.
router.delete('/:id', function (req, res) {
  const id = req.params.id
  const deleteEmployee = DATABASE["employee" + id];
  delete DATABASE[id];
  res.send(deleteEmployee);
})

module.exports = router;
