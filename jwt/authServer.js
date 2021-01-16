if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = 4000;

app.use(express.json())

// TODO: Put in a store
let refreshTokens = [];

app.post('/login', (req, res) =>{
	// Authenticate User
	// jwt implementation

	// TODO: return username, using req is undefined
	const username = `${(req.body.username)? req.body.username : 'guest'}` 
	// const username = 'mya';
	// const username = 'tia';
	const user = { username: username };
	
	console.log(user);

	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user,
		process.env.REFRESH_TOKEN_SECRET);

	refreshTokens.push(refreshToken)

	res.json({ accessToken:accessToken,
		refreshToken:refreshToken });
});

app.post('/refresh',(req, res) =>{
	console.log(`app.post: req.body.username: ${req.body.username}`)
	const refreshToken = `${req.body.token}`;

	if(refreshToken == null) return res.sendStatus(401);

	if(refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
		// TODO user.username is undefined
		console.log(user)
		if(err) return res.sendStatus(403);

		const accessToken = generateAccessToken({username: user.username})
		res.json({accessToken:accessToken})
	})
})

app.delete('/logout',(req, res) =>{
	refreshTokens = refreshTokens
									.filter(token => token !== req.body.token)
	res.sendStatus(204);
});

function generateAccessToken(user){
	console.log(`generateAccessToken func: user: ${user.username}`)
	return jwt.sign(user,
		process.env.ACCESS_TOKEN_SECRET,
		{expiresIn: '15s'}
	)
}

app.listen(PORT);