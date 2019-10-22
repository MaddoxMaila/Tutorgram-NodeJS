
const express = require('express');
const API = require('./api/api.js');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const session = require('express-session');

const app = express();

const frontendPath = 'frontend/';
const FrontEndLayouts = `${frontendPath}layouts`;
const FrontEndStatic = `${frontendPath}static`;
const FrontCDN = 'cdn/';

app.use(express.static(frontendPath));
app.use(express.static(frontendPath));
app.use(express.static(frontendPath));
app.use(express.static(FrontCDN));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(session({secret: 'iamtheshit'}));


let form = null;

const notifier = {error : true, message : "Hey, We See You, What You Trying To Do!!"};


/**
 * 
 *  # Render Pages Routes
 * 
 */

app.get('/login', (request, response) => {

    if(request.session.userId){                                  // Check Session For Logged In

        response.redirect('/home');                              // Since User Is Logged In, Redirect To Home

    }else{                                                       // Not Logged?, Show Login Page

        response.sendFile(`${FrontEndLayouts}/account/login.html`, {root : __dirname}); 

    }

});

app.get('/signup', (request, response) => {

    response.sendFile(`${FrontEndLayouts}/account/signup.html`, {root : __dirname});

});

app.get('/home', (request, response) => {

    if(request.session.userId){

        response.sendFile(`${FrontEndLayouts}/home/home.html`, {root : __dirname});

    }else{

        response.redirect('/login');

    }

});

app.get('/user/:username', (request, response) => {

    // if(request.session.userId){

        response.sendFile(`${FrontEndLayouts}/user/user.html`, {root : __dirname});

    // }else{

    //     response.redirect('/login');

    // }

});

app.get('/session', (request, response) => {

    console.log(request.session.userId);
    response.json((request.session.userId) ? {session_set : true, id : request.session.userId} : {session_set : false, id : 0});
    response.end();

});                                                                   // Route To Return Session Of LoggedIn User


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


 app.post('/api/signup', (request, response) => {

    form = new formidable.IncomingForm();                    // Form Object To Grab And Store Incoming Form

    form.parse(request, (err, fields, files) => {

        if(err) throw err;

        if(fields.username == '' || fields.email == '' || fields.password == ''){

            response.json({error : true, message : "Hey, You Better Stop What You're Doing. We See You!, Use Our Form"});
            response.end();

        }else{

            let signUp = new API.createAccount(fields);       // Instantiate An Object To Create A New User!

            signUp.create((data) => {                         // CallBack Function

                if(data.error == false && data.created == true){

                    request.session.userId = data.user.user_id;

                }

                response.json(data);
                response.end();

            });                                               // End Of Create

        }

    });                                                       // End Of Form Parse



 });

 app.post('/api/login', (request, response) => {


    form = new formidable.IncomingForm();                      // Grab Incoming Form From Request

    form.parse(request, (err, fields, files) => {

        if(err) throw err;
        
    if(fields.email == '' || fields.password == ''){           // Check Fields

        response.json({error : true, message : "What Are You Trying To Do?, Use Our Form And Website"});
        response.end();

    }else{

        let login = new API.login(fields.email, fields.password);   // Login Class To Check User Account Details

           login.accessor((data) => {

               if(data.logged){

                   
                   request.session.userId = data.user.user_id;   // Set Session Of The Logged In User!

               }

               console.log(data);

               response.json(data);                             // Send Json Response To FrontEnd
               response.end();
               

           });

        }                                                        // End OF If

    });                                                          // Incoming Form Parse

 });                                                             // End Of API Login Route

 app.get('/api/posts', (request, response) => {

    let posts = new API.posts(1);

    posts.getPosts(0, (data) => {
        
        response.json(data);

        response.end();
    });

 });                                                             // End Of API posts Route

 app.get('/api/user/:username', (request, response) => {

    
    let form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        //if(err) throw err;

        // console.log(request);

        if(fields.context == ''){

            response.json({error : true, message : "Hey, We See You, What You Trying To Do!!"});
            response.end();
            
        }else{

            let quick = new API.quick(request.params.username);   // Convert The Url Username It's User Id Equivalent       

            quick.convertUsername((data) => {

                                                                  // Call user API To Get Detailed User Info
                let user = new API.user(fields.context, data.user_id, (request.session.userId) ? request.session.userId : 0);

                user.info((data) => {

                    response.json(data);
                    response.end();

                }, true);                                         // Callback Function To Return Data


            });                                                   // End Of Callback

        }

    });                                                           // Parse Form To Get Form Fields

 });                                                              // End Of API user info Route

 app.post('/api/follow', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        if(fields.context == '' || fields.user_one_id == '' || fields.user_two_id == ''){

            response.json(notifier);
            response.end();

        }else{

            let follow = new API.follows(fields);

            follow.followUser((data) => {

                response.json(data);
                response.end();

            });

        }                                                         // End Of If

    });                                                           // End Of Parse

 });

 /**
 *
 *
 *  # End Of API Routes
 *
 */

 app.listen('5000',() => {                                         // Start Server!

        console.log('Tutorgram Server Has Started On Port 5000!');

  });
