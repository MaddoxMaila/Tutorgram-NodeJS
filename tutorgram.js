const express = require('express');
const API = require('./api/api.js');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const session = require('express-session');
const fs = require('fs');
const passwordHash = require('password-hash');

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
app.use(session({
secret : 'iamtheshit', maxAge : Date.now + (30 * 86400 * 1000)
}));

app.use(session({secret: 'iamtheshit'}));


let form = null;

const notifier = {error : true, message : "Hey, We See You, What You Trying To Do!!"};


/**
 * 
 *  # Render Pages Routes
 * 
 */


app.get('/', (request, response) => {
    response.redirect('/login');
})
app.get('/login', (request, response) => {

    /*if(request.session.userId){                                  // Check Session For Logged In

        response.redirect('/home');                              // Since User Is Logged In, Redirect To Home

    }else{   */                                                    // Not Logged?, Show Login Page

        response.sendFile(`${FrontEndLayouts}/account/login.html`, {root : __dirname}); 

    //}

});

app.get('/signup', (request, response) => {

    response.sendFile(`${FrontEndLayouts}/account/signup.html`, {root : __dirname});

});

app.get('/home', (request, response) => {

    // if(request.session.userId){

        response.sendFile(`${FrontEndLayouts}/home/home.html`, {root : __dirname});

   /* }else{

        response.redirect('/login');

    }*/

});

app.get('/user/:username', (request, response) => {

    // if(request.session.userId){

        response.sendFile(`${FrontEndLayouts}/user/user.html`, {root : __dirname});
/*
    }else{

        response.redirect('/login');

    }*/

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

            // fields.password = passwordHash.generate(fields.password);

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

        response.json(notifier);
        response.end();

    }else{

        // fields.password = passwordHash.generate(fields.password)
        console.log(fields);
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

    form = request.query;

    if(form.context == ''){

        response.json(notifier);
        response.end();

    }else{

        let posts = null;

        if(form.context == 1){

            posts = new API.posts(form.context, 0, 0);

        }else if(form.context == 2){

            posts = new API.posts(form.context, form.user_id, 0);

        }else if(form.context == 3){

            posts = new API.posts(form.context, 0, form.post_id);

        }else{

            response.json(notifier);
            response.end();

        }

        posts.get(form.view_id, (data) => {

            response.json(data);
            response.end();

        });

    }

 });                                                             // End Of API posts Route

 app.get('/api/user/:username', (request, response) => {

    
    let form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        //if(err) throw err;

        // console.log(request);

        if(fields.context == '' || fields.viewer_id == ''){

            response.json(notifier);
            response.end();
            
        }else{

            let quick = new API.quick(request.params.username);   // Convert The Url Username To It's User Id Equivalent       

            quick.convertUsername((data) => {

                                                                  // Call user API To Get Detailed User Info
                let user = new API.user(fields.context, data.user_id, fields.viewer_id);

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

            if(fields.context == 1){                            // For Following OR Unfollowing

                follow.followUser((data) => {

                response.json(data);
                response.end();

              });

            }else if(fields.context == 2 || fields.context == 3){

                follow.whoFollows((data) => {

                    response.json(data);
                    response.end();

                });                                              // End Of whoFollows

            }else{                                               // Illegal Request!

                response.json(notifier);
                response.end();

            }

        }                                                         // End Of If

    });                                                           // End Of Parse

 });



 app.post('/api/react', (request, response) => {

      form = new formidable.IncomingForm();

      form.parse(request, (err, fields, files) => {

          if(fields.context == '' || fields.user_id == '' || fields.post_id == ''){


            response.json(notifier);
            response.end();

          }else{

            let react = new API.react(fields);

            console.log(fields);

              if(fields.context == 1){

                 react.like((data) => {

                    response.json(data);
                    response.end();

                 });                                                       // End Of Callback 

              }

          }                                                                // End OF Filter If

      });


 });

 app.post('/api/ask', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        if(fields.ask_text == '' || fields.context == ''){

            response.json(notifier);
            response.end();

        }else{

            let quick = new API.quick(fields.user_id);

            quick.convertUserId((res) => {

                files.file.user_id = fields.user_id;
                files.file.username = res.username;
                files.file.context = fields.context;
                files.file.newPath = __dirname;

            console.log(fields);
                let ask = null;

                if(fields.context == 1){

                    files.file.text = fields.ask_text;

                    ask = new API.ask(files.file);

                }else{

                    files.file.upload_type = fields.upload_type;

                    ask = new API.ask(files.file);

                }

                ask.add((data) => {
                    console.log(data);
                    response.json(data);
                    response.end();

                });
                
            });

        }

    });

 });   // End Of Ask Route

 app.post('/api/search', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        if(fields.context == '' || fields.user_id == '' || fields.q == ''){

            response.json(notifier);
            response.end();

        }else{

            let query = new API.search(fields);

            query.get((data) => {

                response.json(data);
                response.end();

            });

        }

    });


 });

   // For Searching Tutors Nearby!!

 app.post('/api/tutors', (request, response) => {

    form = new formidable.IncomingForm();


    form.parse(request, (err, fields, files) => {

        if(fields.subject == '' && fields.location == '' && fields.user_id == '') {

            response.json(notifier);
            response.end();

        }else{

            let tutors = new API.tutors(fields);

            tutors.getAll(fields.user_id, (data) => {

                response.json(data);
                response.end();

            });

        }

    });

});

 app.post('/api/messages', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        if(fields.user_one_id == '' || fields.user_two_id == '' || fields.context == ''){

            response.json(notifier);
            response.end();

        }else{

            let chats = null;

            if(fields.context == 2 || fields.context == 3){

                fields.message_url = '';

                console.log(files.message_file);

                chats = new API.messages(fields);

            }else if(fields.context == 1){

                console.log('Running Without A File! Why You Executing Even If The File Is Undefined?');
                
                files.message_file.user_one_id = fields.user_one_id;
                files.message_file.user_two_id = fields.user_two_id;
                files.message_file.context = fields.context;
                files.message_file.message_text = fields.message_text;

                if(files.message_file.size != 0){
                    files.message_file.message_url = `http://192.168.43.13:5000/cdn/messages/${files.message_file.name}`;
                    fs.rename(files.message_file.path, `${__dirname}/cdn/cdn/messages/${files.message_file.name}`, (err) => {

                    if(err) console.log(err);

                    });

                }else{

                    files.message_file.message_url = '';

                }

                chats = new API.messages(files.message_file);

            }else{

                fields.message_url = '';

                console.log(files.message_file);

                chats = new API.messages(fields);

            }

            if(fields.context == 1 || fields.context == 7){  // For Sending Messages

                chats.sendMessage((data) => {

                    response.json(data);
                    response.end();

                });

            }else if(fields.context == 2){ // For Getting Chats

                chats.viewChats((data) => {

                    response.json(data);
                    response.end();

                });

            }else if(fields.context == 3){ // For Getting Messages

                chats.getMessages((data) => {

                    response.json(data);
                    response.end();

                });
            } // End Of Context Check
        }
    });   // End Pf Parse

 });  // End Of Messages Route

 app.post('/api/become-a-tutor', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        if(fields.subject == '' || fields.price == '' /*|| files.qualification_file == undefined*/){

            response.json(notifier);
            response.end();

        }else{

            console.log(fields);

            console.log(files.qualification_file);

            fs.rename(files.qualification_file.path, `${__dirname}/cdn/cdn/qualifications/${files.qualification_file.name}`, (err) => {

                if(err) console.log(err);
            });

            fields.qualification_file_url = `http://192.168.43.13:5000/cdn/qualifications/${files.qualification_file.name}`;

            let beAtutor = new API.beTutor(fields);

            beAtutor.insertTutor((data) => {

                response.json(data);
                response.end();

            });

        }

    });

 });
app.post('/api/crumbs', (request, response) => {

    form = new formidable.IncomingForm();


    form.parse(request, (err, fields, files) => {

        let crumbs = null;


        if(fields.context == 1 || fields.context == 7){

            crumbs = new API.crumbs({user_id : fields.user_one_id, tutor_id : fields.user_two_id});

            crumbs.requests((data) => {

                response.json(data);
                response.end();

            });

        }else if(fields.context == 2){

            crumbs = new API.crumbs(fields);

            crumbs.review((data) => {

                response.json(data);
                response.end();

            });

        }

    });

});

app.get('/api/notifications', (request, response) => {


    form = request.query;

    if(form.context == '' || form.user_id == ''){

        response.json(notifier);
        response.end();

    }else{

        let getNotification = new API.notifications(form);

        getNotification.userNotifications((data) => {

            response.json(data);
            response.end();

        });

    }

});

app.post('/api/comment', (request, response) => {

    form = new formidable.IncomingForm();

    form.parse(request, (err, fields, files) => {

        let comment = null;

        if(files.comment_file.size == 0 && fields.comment_text != ''){

            fields.type = 'text';
            fields.comment_url = '';

            comment = new API.comment(fields);

        }else if(files.comment_file.size != 0){


            fs.rename(files.comment_file.path, `${__dirname}/cdn/cdn/comments/${files.comment_file.name}`, (error) => {

                if(error) throw err;

            });

            files.comment_file.user_id = fields.user_id;
            files.comment_file.post_id = fields.post_id;
            files.comment_file.comment_text = fields.comment_text;
            files.comment_file.context = fields.context;
            files.comment_file.type = (files.comment_file.type == 'video/mp4' || files.comment_file.type == 'video/mkv') ? 'video' : 'image';
            files.comment_file.comment_url = `http://192.168.43.13:5000/cdn/comments/${files.comment_file.name}`;

            comment = new API.comment(files.comment_file);

        }

        
        comment.addComment((data) => {

            response.json(data);
            response.end();

        });

    });

});

app.get('/api/comment', (request, response) => {

    form = request.query;

      if(form.user_id == '' || form.comment_id == '' || form.context == ''){

          response.json(notifier);
          response.end();

      }else{

        let Comments = new API.comment(form);


        Comments.getComments(form.user_id, (data) => {

            response.json(data);
            response.end();

        });


      }

});

 /**
 *
 *
 *  # End Of API Routes
 *
 */

 app.listen('5000','192.168.43.13' || 'localhost',() => {                                         // Start Server!

        console.log('Tutorgram Server Has Started On Port 5000!');

  });
