const express = require('express');
const app = express();
const port = 3000;
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require('path')
let methodOverride = require('method-override')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// create the connection                
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'unknownrider',
  password: 'rK@9892960562',
});

//created api to show database users count 
app.get("/", (req, res) => {
  let q = `select count(*) from users`;
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"]
      res.render("home.ejs", {count});
    });
  } catch (err) {
    console.log(err);
    res.render("some error in database");
  }
});

//api for show details of data
app.get("/user", (req,res)=>{
  let q= `select * from users`;
  try {
    db.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", {users});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
})


//api for edit details
app.get("/user/:id/edit", (req,res)=>{
  let { id }= req.params;
  let q = `select * from users where id = '${id}'`;
  
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0]
      res.render("edit.ejs", {user});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
})

//update (DB) data 
app.patch("/user/:id",(req,res)=>{
  let { id }= req.params;
  let { password: formPass, username:newUserName } = req.body;
  let q = `select * from users where id = '${id}'`;
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0]
      if(formPass != user.password){
        res.send("your password is incorrect")
      }else{
        let q2 = `update users set username ='${newUserName}' where id = '${id}'`
        db.query(q2, (err, result) => {
          if (err) throw err; 
          res.redirect("/user")
        })

      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
})

app.listen(port, ()=>{
  console.log(`server is running on port:${port}`)
})




//fake data generate using faker package 
let getRandomUser= ()=>{
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
}

let usersData = [];
//generate 100 record through loop
for(let i = 1; i<=100; i++){
  usersData.push(getRandomUser());
};


