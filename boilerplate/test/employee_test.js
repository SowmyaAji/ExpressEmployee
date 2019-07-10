'use strict';

const request = require('supertest');
const app = require('../app.js');

//Testing get all employees endpoint
describe('GET /api/employees', function () {
    it('respond with json containing a list of all employees', function (done) {
        request(app)
            .get('/api/employees')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

//Testing get an employee endpoint by giving an existing user
describe('GET /api/employees/:id', function () {
    it('respond with json containing a single user', function (done) {
        request(app)
            .get('/api/employees/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


//Testing post an employee endpoint
describe('POST /api/employees', function () {
    let data = {
        "firstName": "Dummy",
        "lastName": "Dummy",
        "hireDate": "2000-10-10",
        "role": "VP",
    }
    it('respond with 200 ok',
        function (done) {
            request(app)
                .post('/api/employees')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
});

//Testing post an employee endpoint with wrong hire date  
describe('POST /api/employees', function () {
    let data = {
        "firstName": "Dummy",
        "lastName": "Dummy",
        "hireDate": "2020-10-10",
        "role": "LACKEY",
    }
    it('respond with 400 not created',
        function (done) {
            request(app)
                .post('/api/employees')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect('["Invalid hire date provided"]')
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
});

//Testing post an employee endpoint with creating an extra CEO
describe('POST /api/employees', function () {
    let data = {
        "firstName": "Rummy",
        "lastName": "Crummy",
        "hireDate": "2000-10-10",
        "role": "CEO",
    }
    it('respond with 400 not created',
        function (done) {
            request(app)
                .post('/api/employees')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect('["Hey, the CEO is Al Gore!"]')
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
});

//Testing update an employee endpoint
describe('PUT /api/employees/:id', function () {
    let data = {
        "firstName": "Allan",
        "lastName": "Gore",
        "hireDate": "2002-10-10",
        "role": "VP",
    }
    it('respond with 200 updated',
        function (done) {
            request(app)
                .put('/api/employees/1')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
});

describe('DELETE /api/employees/:id', function () {
    it('respond employee deleted', function (done) {
        request(app)
            .delete('/api/employees/3')
            .expect(200, done);
    });
});