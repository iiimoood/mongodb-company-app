const mongoose = require('mongoose');
const Employee = require('../employee.model');
const expect = require('chai').expect;

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Finances',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return proper document by various params with findOne method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      const expectedName = 'John';
      const employeeTwo = await Employee.findOne({ lastName: 'Doe' });
      const expectedLastName = 'Doe';

      expect(employee.firstName).to.be.equal('John');
      expect(employee.lastName).to.be.equal('Doe');
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Finances',
      });
      await testEmpTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'John' },
        { $set: { firstName: 'Steve' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: 'Steve',
      });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ department: 'IT' });
      employee.department = 'Customer Service';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        department: 'Customer Service',
      });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Updated!' } });
      const employees = await Employee.find({ lastName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Finances',
      });
      await testEmpTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removeEmployee = await Employee.findOne({
        firstName: 'John',
      });
      expect(removeEmployee).to.be.null;
    });
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ department: 'IT' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        department: 'IT',
      });
      expect(removedEmployee).to.be.null;
    });
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
