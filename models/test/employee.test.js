const mongoose = require('mongoose');
const Employee = require('../employee.model');
const expect = require('chai').expect;

describe('Employee', () => {
  it('should throw an error if no arg', () => {
    const emp = new Employee({});

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it('should throw an error if args are not strings', () => {
    const emp = new Employee({}, [], undefined);

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it('should not throw an error if args are correct', () => {
    const emp = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: 'IT',
    });

    emp.validate((err) => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
