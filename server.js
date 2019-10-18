
const express = require('express');
const api = require('./api/api.js');
const bodyParser = require('body-parser');

const app = express();

const frontendPath = 'frontend/';
const FrontEndLayouts = `${frontendPath}layouts`;
const FrontEndStatic = `${frontendPath}static`;

app.use(express.static(frontendPath));
app.use(express.static(frontendPath));
app.use(express.static(frontendPath));

app.use(bodyParser.urlencoded({extended : true}));


/**
 * 
 *  # Render Pages Routes
 * 
 */

app.get('/login', (request, response) => {

    response.sendFile(`${FrontEndLayouts}/account/login.html`, {root : __dirname});

});

app.get('/signup', (request, response) => {

    response.sendFile(`${FrontEndLayouts}/account/signup.html`, {root : __dirname});

});

app.get('/user/:username', (request, response) => {

    response.sendFile(`${FrontEndLayouts}/user/user.html`, {root : __dirname});

});


/**
 * 
 *  # End Of Render Pages Routes
 * 
 */

/**
 * 
 *  # Application Programming Interface Routes To Handle All Data Requests!!
 * 
 */

 app.post('/api/login/', (request, response) => {

    let login = new api.login(request.body.email, request.body.response);

    login.accessor((data) => {

        response.send(JSON.stringify(data));

        response.end();

    });

 }); // End Of API Login Route

 app.get('/api/posts', (request, response) => {

    let posts = new api.posts(1);

    posts.getPosts(0, (data) => {
        
        response.send(JSON.stringify(data));

        response.end();
    });

 }); // End Of API posts Route

 app.get('/api/user/:username', (requests, response) => {
    
    const username = requests.params.username;

    let user = new api.user(1, username, /* session! */0);

    user.formatter((info) => {

        response.send(JSON.stringify(info));

    }, true);

 }); // End Of API user info Route


 /**
 *
 *
 *  # End Of API Routes
 *
 */

 app.listen('5000',() => {

        console.log('Server Started On Port 3000');

  });
