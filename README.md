**TASK**

- Create a node app that implements a set of REST APIs allowing CRUD functionality for an employee resource.

**Expected Time**

This exercise is expected to take about 4-5 hours total, over the course of 2-3 days.

**Submission Instructions**

Post your solution to a public repository on [Github](https://github.com/). Send the repository URL back to the same person who sent you these instructions.

**Additional Guidance**

Persistent storage is not necessary, just use an in memory object to track employee records.

Use any npm modules you find useful.

**Expected Endpoints**

POST http://localhost:3000/api/employees

- Create a new record using a randomly generated value as the unique identifier (i.e. _id field).  Validate that the following fields are included in the POST body and have the right type/format as posted below:
    - firstName (String)
    - lastName (String)
    - hireDate (YYYY-MM-DD format must be in the past)
    - role (String) - must be one of the following (case-insensitive):
        - CEO (can only be one of these)
        - VP
        - MANAGER
        - LACKEY

    - In addition to the fields included in the POST body, include two fields in each new record that are populated by different external APIs.  For example, a favorite joke and a favorite quote, or a favorite joke and a second favorite joke.  As long as the two external APIs are different.
        - Possible API endpoints:

            https://ron-swanson-quotes.herokuapp.com/v2/quotes

            https://icanhazdadjoke.com

            https://quotes.rest/qod

PUT http://localhost:3000/api/employees/:id

- Replace the record corresponding to :id with the contents of the PUT body


GET http://localhost:3000/api/employees/:id

- Return the record corresponding to the id parameter


GET http://localhost:3000/api/employees

- Return all current records


DELETE http://localhost:3000/api/employees/:id

- delete the record corresponding to the id parameter


Create
$ curl -k -H "Content-Type: application/json" -X POST -d '{"firstName":"Walter", "lastName": "White", "hireDate": "2019/01/01", role: 'vp'}' "https://localhost/:3000/api/employees"
 
Index
$ curl -k  -H "Content-Type: application/json" -X GET "http://localhost:3000/api/employees"

Output:
{"employee1":{"id":"1","firstName":"Al","lastName":"Gore","hireDate":"2000-10-10","role":"CEO"}}
 
Read
$ curl -k -H "Content-Type: application/json" -X GET   "https://localhost/:3000/api/employees/1"
 
Update
$ curl -k -H "Content-Type: application/json" -X PUT -d '{"firstName":"Walter", "lastName": "Reed", "hireDate": "2019/02/01", role: 'vp'}' "https://localhost/:3000/api/employees/1"
 
 
Delete
$ curl -k -H "Content-Type: application/json" -X DELETE "https://localhost/:3000/api/employees/1"

$ curl -k -H "Content-Type: application/json" -X POST -d '{"firstName":"Walter", "lastName": "White", "hireDate": "2019/01/01", "role": "vp"}' "http://localhost:3000/api/employees"
["Invalid date format, please provide in the YYYY-MM-DD one"]



$ curl -k -H "Content-Type: application/json" -X GET "http://localhost:3000/api/employees"
{}

