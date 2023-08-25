var express = require("express");
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;

var conStr = "mongodb://127.0.0.1:27017";

var app = express();

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/customers", (req, res)=>{
    mongoClient.connect(conStr)
    .then(obj=>{
         var database = obj.db("task");
         database.collection("customers").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
         })
    })
    .catch(err=>{
        console.log(err);
    })
});

app.post("/registercustomer", (req, res)=>{
     var customerDetails = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Age: parseInt(req.body.Age),
        Email: req.body.Email,
        Mobile: req.body.Mobile
     };
     mongoClient.connect(conStr)
     .then(obj=>{
         var database = obj.db("task");
         database.collection("customers").insertOne(customerDetails)
         .then(()=>{
            console.log("Record Inserted");
            res.redirect("/customers");
         })
     })
});
app.get("/tasks", (req, res)=>{
    mongoClient.connect(conStr).then((clientObject)=>{
        var database = clientObject.db("task");
        database.collection("tasklibrary").find({}).toArray().then((documents)=>{
            res.send(documents);
        })
    })
});

app.get("/tasks/:id", (req, res)=> {
    var task_id = parseInt(req.params.id);
    mongoClient.connect(conStr).then((clientObject)=>{
        var database = clientObject.db("task");
        database.collection("tasklibrary").find({id:task_id}).toArray().then(documents=>{
            res.send(documents);
        })
    })
});

app.post("/addtask", (req, res)=> {
    var task = {
        "id": parseInt(req.body.id),
        "title": req.body.title,
        "description": req.body.description,
        "completed": (req.body.subscribed=="true")?true:false
    }
    mongoClient.connect(conStr).then(clientObject=>{
        var database  = clientObject.db("task");
        database.collection("tasklibrary").insertOne(task).then((result)=>{
            console.log(`Task Inserted`);
            res.redirect("/tasks");
        })
    })
});

app.put("/updatetask/:id", (req, res)=>{
    var task_id = parseInt(req.params.id);
    var task = {
        "title": req.body.title,
        "description": req.body.description,
        "completed": (req.body.subscribed=="true")?true:false
    }
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("task");
        database.collection("tasklibrary").updateOne({id:task_id},{$set:task}).then(result=>{
            console.log(`Task Updated`);
            res.redirect("/tasks");
        })
    })
});

app.delete("/deletetask/:id", (req, res)=>{
    var task_id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("task");
        database.collection("tasklibrary").deleteOne({id:task_id}).then((result)=>{
            console.log(`Task Deleted`);
            res.redirect("/tasks");
        })
    })
})

app.listen("5000");
console.log(`Server Started : http://127.0.0.1:5000`);
