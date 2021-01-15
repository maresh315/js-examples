if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methOverride = require('method-override');

const app = express();

initializePassport(
	passport, 
	(email) => users.find(user => user.email === email),
	(id) => users.find(user => user.id === id)

);

app.set('view-engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methOverride('_method'));
// Temp DB
const users = [];
const PORT = 3000;


app.get('/', checkAuthenticated, (req, res) =>{
	res.render('index.ejs', { 
		name: req.user.name, 
		email: req.user.email 
	})
});

app.get('/login', checkNotAuthenticated, (req, res) =>{
	res.render('login.ejs')
});

app.get('/register', checkNotAuthenticated, (req, res) =>{
	res.render('register.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.post('/register', checkNotAuthenticated, async (req, res) =>{
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 12);

		users.push({
			id: Date.now(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		});
		res.redirect('/login');
		
	} catch  {
		res.redirect('/register');
	}
	console.log(users);
});

app.delete('/logout', (req,res) =>{
	req.logOut();
	res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return res.redirect('/');
	}
	next()
}

app.listen(PORT);