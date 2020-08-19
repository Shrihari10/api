const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const db = require('./mongokey').MongoURI;
const Student = require("./model");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname,"")));

mongoose.connect(db, { 
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req,res) =>{
    res.send("hello world");
});

app.post('/add', (req,res) => {
    const student = new Student ({
        name: req.body.name,
        rollNumber: req.body.rollNumber,
        department: req.body.department
    });

    student.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch( err => {
            res.json({ message: err});
        });

});

app.put('/update/:id', (req,res) =>{
    Student.findOneAndUpdate( { rollNumber:req.params.id }, req.body,  { useFindAndModify: false }).then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Student with rollnumber=${req.params.id}. Maybe Student was not found!`
          });
        } else res.send({ message: "Student was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Student with rollnumber=" + req.params.id
        });
      });
});

app.delete('/delete/:id', (req,res) => {
    Student.findOneAndDelete({ rollNumber: req.params.id })    
        .then(data => {
            if (!data) {
                res.status(404).send({
                message: `Cannot delete Student with rollnumber=${req.params.id}. Maybe Student was not found!`
                });
            } else {
                res.send({
                message: "Student was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Student with rollnumber=" + req.params.id
            });
        });
});

app.get('/rollnumber/:id', (req,res) => {
    Student.findOne({rollNumber: req.params.id})
            .then(data => {
                if(!data){
                    res.status(404).send ({ message: `Cannot get Student with rollNumber= ${req.params.id}`});
                }
                else
                    res.json(data.department);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not Find Student with rollnumber=" + req.params.id
                });
            }); 
})

let users = [];
app.post('/search', (req,res)=>{
    Student.find().then( students => {
        for(let i=0;i<students.length;i++){
            if(students[i].name.includes(req.body))
            users[i] = students[i].name;
        }
        res.send(users);
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`listening on port ${port}`)});