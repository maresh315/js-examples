require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = 3000;

app.use(express.json())

const blurbs = [
	{
		username: 'mya',
		blurb: 'River Otters are cute!'
	},
	{
		username: 'tia',
		blurb: "Dolphins should bbe man's best friend"
	}
];

app.get('/blurbs', authenticateToken, (req, res) =>{
	res.json(blurbs.filter(blurb => blurb.username === req.user.username));
});

app.post('/login', (req, res) =>{
	// Authenticate User
	// jwt implementation

	const username = req.body.username
	const user = { name: username }

	const accessToken = jwt.sign(user,
		process.env.ACCESS_TOKEN_SECRET,
		{expiresIn: '1h'}
	)

	res.json({accessToken:accessToken})
});

function authenticateToken(req,res,next){
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
		if(err) {
			console.log(err)
			return res.sendStatus(403)
		};
		
		req.user = user;
		next();
	})
}

app.listen(PORT);