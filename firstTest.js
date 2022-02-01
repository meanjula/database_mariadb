"use strict";
const mariadb = require("./databse"); // requiring maraidb

require("dotenv").config();

const options = {
  host: "localhost",
  port: 3306,
  user: "zinc",
  password: process.env.PASSWORD,
  database: "employeedb",
  allowPublicKeyRetrieval: true,
};

const db = new mariadb(options);

//db.doQuery("select * from employee").then(console.log).catch(console.log);
function printWorkers(employee) {
  for (let person of employee)
    console.log(
      `${person.employeeId}:${person.firstname} ${person.lastname}` +
        ` Dept: ${person.department}, ${person.salary}£`
    );
}

async function getAll() {
  try {
    const result = await db.doQuery("select * from employee ");
    if (result.resultSet) {
      printWorkers(result.queryResult);
    }
  } catch (error) {
    console.log(error);
  }
}
async function get(id) {
  try {
    const result = await db.doQuery(
      "select * from employee where employeeId=?",
      [id]
    );
    printWorkers(result.queryResult);
  } catch (error) {
    console.log(error);
  }
}

async function add(person) {
  try {
    const parameters = [
      person.employeeId,
      person.firstname,
      person.lastname,
      person.department,
      person.salary,
    ];
    //const parameters = Object.values(person)
    const sql =
      "insert into employee(employeeId,firstname,lastname,department,salary)" +
      "values(?,?,?,?,?)";
    //const sql = `insert into employee values(?,?,?,?,?)`;
    const status = await db.doQuery(sql, parameters);
    console.log("Status", status);
  } catch (error) {
    console.log(error);
  }
}

//deleting object
async function remove(id) {
  try {
    const sql = "delete from employee where employeeId=?";
    const status = await db.doQuery(sql, [id]);
    console.log("removal status", status);
  } catch (error) {
    console.log(error);
  }
}
async function update(person) {
  try {
    const sql =
      "update employee set firstname=?,lastname=?,department=?,salary=? " +
      "where employeeId=?";
    const parameters = [
      person.firstname,
      person.lastname,
      person.department,
      person.salary,
      person.employeeId,
    ];
    const status = await db.doQuery(sql, parameters);
    console.log("Update status:rowChanged =", status.queryResult.rowsChanged);
  } catch (error) {
    console.log(error);
  }
}
//update with message nothing to update
async function update2(person) {
  try {
    const sql =
      "update employee set firstname=?,lastname=?,department=?,salary=? " +
      "where employeeId=?";
    const parameters = [
      person.firstname,
      person.lastname,
      person.department,
      person.salary,
      person.employeeId,
    ];
    const result = await db.doQuery(
      "select employeeId from employee where employeeId=? ",
      [person.employeeId]
    );
    if (result.queryResult.length === 0) {
      console.log(`Nothing to update with id=${person.employeeID}`);
    } else {
      const status = await db.doQuery(sql, parameters);
      console.log("Update status:rowChanged =", status.queryResult.rowsChanged);
    }
  } catch (error) {
    console.log(error);
  }
}
async function run() {
  console.log("###### getAll ####");
  await getAll();
  console.log("###### get(1) ####");
  await get(1);
  console.log("###### get(2) ####");

  await get(2);
  const newEmp1 = {
    employeeId: 6,
    firstname: "gyan",
    lastname: "Jone",
    department: "design",
    salary: 3000,
  };
  await add(newEmp1);

  console.log("###### add ####");
  const newEmp = {
    employeeId: 8,
    firstname: "Ryan",
    lastname: "Jones",
    department: "science",
    salary: 5000,
  };

  await add(newEmp);
  await getAll();
  console.log("###### remove 6 ####");
  await remove(6);

  const updateEmp = {
    firstname: "Byan",
    lastname: "Jonas",
    department: "history",
    salary: 4000,
    employeeId: 8,
  };

  await update2({
    employeeId: 125,
    firstname: "B",
    lastname: "Bond",
    department: "se",
    salary: 2000,
  });
  await getAll();
}
run();
