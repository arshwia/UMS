const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { title } = require('process');
const session = require('express-session');
const bcrypt = require('bcrypt');

const Person = require('./models/person');
const upload = require('./middleware/upload');

const dbURI = "mongodb+srv://arshia:arshia1234@cluster0.wnrotdp.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

const app = express();

app.use(session({
	secret: '@_arshia.coding.hy_@', // یه متن رمز شده دلخواه
	resave: false,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

mongoose.connect(dbURI)
	.then(() => {
		console.log("Connected to DB");
		app.listen(3000, () => {
			console.log("Server running on port 3000");
		});
	})
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.redirect("/login")
})

app.use((req, res, next) => {
	res.setHeader('Cache-Control', 'no-store');
	next();
  });  

app.get("/register", (req, res) => {
	res.render("register", { title: "register" })
})
app.post('/register', upload.single('avatar'), async (req, res) => {
	const { email, password } = req.body;
	const avatar = req.file ? req.file.filename : null;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const person = new Person({ email, password: hashedPassword, avatar });
		await person.save();
		res.redirect('/login');
	} catch (err) {
		console.log(err);
		res.status(500).send("server error");
	}
});




app.get("/login", (req, res) => {
	res.render("login", { title: "login" })
})
app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await Person.findOne({ email });

		if (user && await bcrypt.compare(password, user.password)) {
			req.session.user = user;
			res.redirect('/dashboard');
		} else {
			res.send("tray agen");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("500");
	}
});

app.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				console.log(err);
			}
			res.redirect('/login');
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/dashboard', (req, res) => {
	const user = req.session.user
	if (!req.session.user) {
		return res.redirect('/login');
	}

	res.render('dashboard', { title: 'dashboard', user });
});

