const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { title } = require('process');

const dbURI = "mongodb+srv://arshia:arshia1234@cluster0.wnrotdp.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// mongoose.connect(dbURI)
//     .then(() => console.log("con"))
//     .catch((err) => console.log(err))

app.listen(3000)

app.get("/", (req, res) => {
	res.render("login", { title: "login" })
})