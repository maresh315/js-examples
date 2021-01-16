if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = 3000;

app.use(express.json())

// temp
const blurbs = [
	{
		username: 'mya',
		blurb: 'River Otters are cute!'
	},
	{
		username: 'tia',
		blurb: "Dolphins should may be man's best friend"
	},
	{
		username: 'guess',
		blurb: 'I am just a catch all'
	}
];

app.get('/blurbs', authenticateToken, (req, res) =>{

	res.json(blurbs.filter(blurb => blurb.username == req.user.username ));
});

function authenticateToken(req,res,next){
	const authHeader = req.headers['authorization'];
	// jwt -=> Bearer [TOKEN]
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
		if (err) return res.sendStatus(403)
		
		console.log(user)
		req.user = user;
		next();
	})
}

app.listen(PORT);