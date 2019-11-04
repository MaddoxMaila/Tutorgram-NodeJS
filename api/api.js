const mysql = require('mysql');
const FileSystem = require('fs');


class Database{

    constructor(){

        this.connection = mysql.createConnection({
            host : "localhost",
            password : "",
            user : "root",
            database : "tutorgram"
        });
        
        this.connection.connect(
            (error) => {

                if(error) throw error;

            }
        );
    }

    query(sql, args){

        return new Promise(
            (resolve, reject) => {

                this.connection.query(sql, args,
                   (error, results) => {

                       if(error) reject(error);

                       resolve(results);

                   } // End Of Callback Function
                ); // End of Query

            }
        );

    }
    data(resp){

        return new Promise((resolve, reject) => {

            if(resp){

                resolve(resp);

            }else{
               
                reject(resp);

            }

        });

    }

}


exports.quick = class Quick extends Database {

    constructor(username){

        super();

        this.username = username;

    }

    async convertUserId(callback){

        try {
            
            let obj = (await this.query('SELECT username FROM users WHERE user_id = ?', [this.username]));

            callback((obj.length > 0) ? obj[0] : {username : 0})

        } catch (e) {

            console.log(e);
            
        }
    }

    async convertUsername(callback){

        try {

            let obj = (await this.query('SELECT user_id FROM users WHERE username = ? ', [this.username]));
        
            callback((obj.length > 0) ? obj[0] : {user_id : 0});

        } catch(e) {

            // statements
            console.log(e);

        }

    }

}

// let q = new exports.quick("maddo");

// q.convertUsername((data) => {
//     console.log(data);
// })


exports.createAccount = class Register extends Database {

    constructor(userdata){

        super();

        this.account = {

            username : userdata.username, 
            email : userdata.email, 
            password : userdata.password

        };

        this.user = [this.account.username, this.account.email, "student", new Date(), this.account.password, null];

        this.starter = [0, "", "", "", "", ""];

        this.images = [0, "http://192.168.43.13:5000/cdn/images/default.png", "profile", null];
        this.covers = [0, "http://192.168.43.13:5000/cdn/images/cover.png", "cover", null];

                          // [0, "http://192.168.43.13:5000/cdn/images/default_cover.png", "cover", null]

                    

    } // End Of Constructor

    async create(callback){

        let resp = null;

        if((await this.isTaken({column : "username", value : this.account.username})) == false && (await this.isTaken({column : "email", value : this.account.email})) == false){

            let results = await this.query(`INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)`, this.user);

               if(results.affectedRows == 1){

                   this.starter[0] = results.insertId;

                   this.images[0] = results.insertId;

                   this.covers[0] = results.insertId;

                   if((await this.starterPack())){


                       resp = this.onResp(false, true, '/home/');

                       resp.user = (await this.query('SELECT username, email, user_id FROM users WHERE user_id = ?', results.insertId))[0];

                   }else{

                       resp = this.onResp(true, false, "Starter Pack Failed!");

                   }

               }else{


                  resp = this.onResp(true, false, results.affectedRows + " : Rows Are Affected!");
                  
               } // Second If

          }else{


            resp = this.onResp(true, false, "Either Email Or Username Is Taken, Choose Another One");

          } // First If


          if(resp.created == true && resp.error == false){

            let dir = new FileUpload({username : resp.user.username});

            let res = (await dir.makeUserDir());

            resp.dir = res.created;

            callback(resp);

          }else{

            callback(resp);

          }

     } // End Of Create

     onResp(e, c, m){

        return {
            error : e,
            created : c,
            message : m
        };

     } // End Of OnResp

    // To Check If Theres Already An Account Using This Username/ Email

    async isTaken(args){

        let bool = (await this.query(`SELECT user_id FROM users WHERE ${args.column} = ?`, [args.value])).length > 0 ? true : false;

        console.log(bool)
        return new Promise((resolve, reject) => {

            resolve(bool);

        });

    } // End Of isTaken()

    async starterPack(){

        let bioBool = (await this.query('INSERT INTO bio VALUES(?, ?, ?, ?, ?, ?)', this.starter)).affectedRows == 1 ? true : false;

        let imgBool = (await this.query('INSERT INTO user_images VALUES(?, ?, ?, ?)', this.images)).affectedRows == 1 ? true : false;

        let coverBool = (await this.query('INSERT INTO user_images VALUES(?, ?, ?, ?)', this.covers)).affectedRows == 1 ? true : false;
        
        let bool = (bioBool == true && imgBool == true && coverBool == true) ? true : false; // Rows Added Successfully!!

        return new Promise((resolve, reject) => {

            resolve(bool);

        });
        

    } // End Of starterPack()

}

exports.login = class UserLogin extends Database {

    constructor(email, password){

        super();
        this.credentials = [email, password];
        this.response = {};

    }

    async accessor(callback){

        try{

            let results = await this.query('SELECT username, email, account_type, account_date, user_id FROM users WHERE email = ? AND user_pass = ?', this.credentials);
            
            if(results.length === 1){
                // This Credentials Are Correct, Log User In
                this.response =  {
                    error : false,
                    logged : true,
                    resp : results.length, 
                    message : "/home",
                    user: results[0]
                };

            }else if(results.length <= 0 || results.length > 0){

                this.response =  {
                    error : true,
                    logged : false,
                    resp : results.length, 
                    message : "Login Unsuccessful, Check Your Login Details To Check If They Are Correct"
                };

            }

            callback(this.response);

        }catch (error){

            console.log(error);

        }

    }

} // End Of Class Login Definition

// let login = new exports.login("madd@gmail", "maddox");
// login.accessor((data)=>{
//    console.log(data);
// });

exports.user = class User extends Database {

    constructor(context, userId, viewerId = 0){

        super();

        this.args = {

            context : context,
            user_id : userId,
            view_id : viewerId,
            p_picture : 'profile',
            c_picture : 'cover'

        }; // End Of Class Object

    } // End Of Constructor

    async getUserInteration(){

        try {


            let totalPosts, textPosts = [], imgsPosts = [], videoPosts = [];

        totalPosts = await this.query('SELECT post_type,post_id FROM posts WHERE user_id = ?', [this.args.user_id]);// Get Number Of Posts This User Has Posted

           // Check If User Has More Than One Post/s

           if(totalPosts.length > 0){
             
              textPosts = totalPosts.map((post) => { 
                   if(post.type === "text") return post;  
                });

              imgsPosts = totalPosts.map((post) => { 
                  if(post.type === "image") return post;  
               });

               videoPosts = totalPosts.map((post) => { 
                  if(post.type === "video") return post;  
               });

           }

          return new Promise((resolve, reject) => {
              resolve({

                num_of_posts : totalPosts.length,
                text_posts : textPosts.length,
                image_posts : imgsPosts.length,
                video_posts : videoPosts.length
    
              });
          }); // Get Object
            
        } catch (error) {
            
            console.log(error);

        }

    } // End Of getUserInteration

    // Organise The User Data Collected And Return It

    async info(callback, outside){
        
        let gatheredUserInfo = {

            user_info : await this.getUserInfo(),
            user_stats : await this.getFollowers(),
            user_interact : await this.getUserInteration()

        };

        if(outside){
            
            callback(gatheredUserInfo);
            return;

        }else{

            return new Promise((resolve, reject) => {

                if(gatheredUserInfo){

                    resolve(gatheredUserInfo);

                }else{

                    reject({error : true, message : "Promise Rejection"});

                }

            });

        }

    } // End Of Formatter

    async getUserInfo(){

        try {

            let userInfo = {

                user : (await this.query('SELECT username, email, account_type, account_date, user_id FROM users WHERE user_id = ?', [this.args.user_id]))[0], // Get Basic User Information
                
                bio : (await this.query('SELECT * FROM bio WHERE user_id = ?', [this.args.user_id]))[0], // Get            Additional Info
    
                profile_picture : ((await this.query('SELECT image_url FROM user_images WHERE user_id = ? AND type = ?', [this.args.user_id, this.args.p_picture]))[0]), // Get User Profile Picture
    
                cover_picture : ((await this.query('SELECT image_url FROM user_images WHERE user_id = ? AND type = ?', [this.args.user_id, this.args.c_picture]))[0]), // Get User PRofile Cover Picture
    
            };

            return new Promise((resolve, reject) => {

                resolve(userInfo);

            });

        } catch (error) {
           
            console.log(error);
          
        }

    } // End Of getAdditionalInfo

    async getFollowers(){

        try {

            let userFollows = {

                num_of_followers : (await this.query('SELECT follow_id FROM follow WHERE user_two_id = ?', [this.args.user_id])).length, // Get Number Of Followers Following This User
    
                num_of_following : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ?', [this.args.user_id])).length, // Get Number Of Users This User Is Following
    
                isFollowing : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.args.user_id, this.args.view_id])).length == 1 ? true : false, // Is This User Following Viewer?
    
                isFollower : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.args.view_id, this.args.user_id])).length == 1 ? true : false, // Is This Viewer Following User
                isRequested : (await this.query('SELECT * FROM requests WHERE user_id = ? AND tutor_id = ?', [this.args.user_id, this.args.view_id])).length == 1 ? "Requested" : "Request Tutor"
    
            };

            return new Promise((resolve, reject) => {

                resolve(userFollows);

            });
    
        } catch (error) {

            console.log(error);
            
        }

    } // End Of getFollowers

} // End Of Class Def



 // This Following Class Is Used To Return Both Posts And Comments To A Post 

exports.posts = class post extends Database {

    constructor(cxt, userId = 0, postId = 0){

        super();

        this.args = {

            context : cxt

        };

        if(this.args.context == 1){

            this.args.sql = 'SELECT * FROM posts ORDER by post_id DESC';

        }else if(this.args.context == 2){

            this.args.sql = 'SELECT * FROM posts WHERE user_id = ?';

            this.args.user_id = userId;

            this.args.data = [this.args.user_id];

        }else if(this.args.context == 3){

            this.args.sql = 'SELECT * FROM comments WHERE post_id = ?';

            this.args.post_id = postId;

            this.args.data = [this.args.post_id];
        }

        this.response = {};

    } // End Of Constructor

    async get(viewerId, callback){

        try {

            this.response.posts = [];

            let rows = await this.query(this.args.sql, [this.args.data]);

            for(let i = 0; i < rows.length; i++) {

              let User = new exports.user(this.args.context, rows[i].user_id, viewerId);

              let postData = {

                post : rows[i],

                post_data : {

                    liked : ((await this.query('SELECT like_id FROM post_likes WHERE user_id = ? AND post_id = ?', [viewerId, rows[i].post_id])).length == 1) ? true : false,

                    num_of_likes : (await this.query('SELECT like_id FROM post_likes WHERE post_id = ?', [rows[i].post_id])).length,

                    num_of_comments : (await this.query('SELECT comment_id FROM comments WHERE post_id = ?', [rows[i].post_id])).length,

                },

                user : (await User.info(null, false)),



            }; // End Of Local Object

            this.response.posts.push(postData); // Insert Gathered Post Data Into Class Response Object 

        } // End Of Query And ForEach Loop

         this.response.list = this.response.posts.length > 0 ? true : false; // Notify That Posts Where Found Or Not
         
         this.response.error = false; // Was There An Error?

          callback(this.response); // Callback Function To Play With The Data
            
        } catch (error) {
            
            this.response.error = true;

            console.log(error);

        }

    } // End Of getPosts

} // End Of Class Posts Definition


exports.follows = class Follows extends Database {

    constructor(args){

        super();

        this.local = args;

        if(this.local.context == 1){                           // For Following And Unfollowing
            /*

            user_one_id int not null,
            user_two_id int not null,
            follow_type text not null,
            follow_state text not null,
            follow_date text not null,
            follow_id int not null PRIMARY KEY AUTO_INCREMENT
            */

            this.local.sql = 'INSERT INTO follow VALUES(?, ?, ?, ?, ?, ?)';
            this.local.data = [this.local.user_one_id, this.local.user_two_id, 'follow', 'follow', new Date(), null];

        }else if(this.local.context == 2){                    // For Checking Followers

            this.local.sql = 'SELECT * FROM follow WHERE user_two_id = ?';
            this.local.data = [this.local.user_two_id];


        }else if(this.local.context == 3){                    // For Checking Following

            this.local.sql = 'SELECT * FROM follow WHERE user_one_id = ?';
            this.local.data = [this.local.user_two_id];

        }

    } // End Of Constructor

    async whoFollows(callback){

        let resp = {};

        let rows = (await this.query(this.local.sql, [this.local.data]));

          if(rows.length == 0){                               // This User Has No Followers!

               resp.count = 0;
               resp.message = 'Has No Followers';

          }else{                                              // Has Atleast More Than One User

               resp.count = rows.length;
               resp.users = [];

                for(let i = 0; i < rows.length; i++){


                   let User = new exports.user(1, rows[i].user_two_id, this.local.user_one_id);

                   let info = {};

                   info.usr =  (await User.info(null, false));

                   resp.users.push(info);

               }

          }

          callback(resp);

    } // End Of Followers

    async addFollowNotification(callback){

        // this.args.viewer_id, this.args.user_id, this.args.post_id, this.args.type, null

        let notification = new exports.notifications({

            viewer_id : this.local.user_one_id,
            user_id : this.local.user_two_id,
            post_id : 0,
            type : 'follow',
            context : 1

        });

        notification.addNotification((reply) => {

            callback();

        });

    }


    async followUser(callback){

        let resp = {};

        let row = (await this.query('SELECT * FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.local.user_one_id, this.local.user_two_id]));

          if(row.length == 1){

             // Means You Logged In User Already Follows This User
             // Means User Is Unfollowing

             resp.message = ((await this.query('DELETE FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.local.user_one_id, this.local.user_two_id])).affectedRows == 1) ? 'Follow' : 'Unfollow Error';

          }else if(row.length == 0){

             // Means Logged In User Doesnt Follow This User Yet
             // Means User Is Trying To Follow

              resp.message = ((await this.query(this.local.sql, this.local.data)).affectedRows == 1) ? 'Unfollow' : 'Follow Error';

          }else{

            resp.message = 'MessageLess';

          }

          resp.error = false;

          resp.count = {

               followers : (await this.query('SELECT follow_id FROM follow WHERE user_two_id = ?', [this.local.user_two_id])).length,
               following : (await this.query('SELECT follow_id FROM follow WHERE user_one_id =?', [this.local.user_two_id])).length
            
            }

          await this.addFollowNotification(() => {});

          callback(resp);

    } // End Of Follow User

} // End Of Follows


exports.react = class Reaction extends Database {

    constructor(fields){

        super();

        this.args = fields;

        if(this.args.context == 1){

            this.args.sql = 'SELECT like_id FROM post_likes WHERE user_id = ? AND post_id = ?';
            this.args.data = [this.args.user_id, this.args.post_id];

        }

    }  // End OF Constructor

    async addLikeNotification(callback){

        let user_id = (await this.query('SELECT * FROM posts WHERE post_id = ?', [this.args.post_id]))[0].user_id;

        // this.args.viewer_id, this.args.user_id, this.args.post_id, this.args.type, null

        let notification = new exports.notifications({
            viewer_id : this.args.user_id,
            user_id : user_id,
            post_id : this.args.post_id,
            type : 'like',
            context : 1
        });

        notification.addNotification((reply) => {

            callback();

        });

    }

    async like(callback){

        let local = {};

        let rows = (await this.query(this.args.sql, this.args.data));

          if(rows.length == 0){   // User Is Liking


               local.message = ((await this.query('INSERT INTO post_likes VALUES(?, ?, ?)', [this.args.user_id, this.args.post_id, null])).affectedRows == 1) ? 'Liked' : 'Like Error';
               local.like = true;

          }else{                  // User Is Unliking

               local.message = ((await this.query('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', this.args.data)).affectedRows == 1) ? 'Unliked' : 'Unlike Error';
               local.like = false;
          }

          local.count = (await this.query('SELECT like_id FROM post_likes WHERE post_id = ?', [this.args.post_id])).length;

          await this.addLikeNotification(() => {});

          callback(local);

    } // End Of like

}

class FileUpload{

    constructor(file){

        //console.log(FileSystem);
        this.file = file;

    }

     moveFile(callback){

        let moved = null;

        if((this.makeUserDir()).created){

                try {
                    FileSystem.renameSync(this.file.path, this.file.newPath);

                return {moved : true};
                } catch(e) {
                    // statements
                    return {moved : false, error : e};
                }

            }else{

                return {moved : false};

            }

    }

    makeUserDir(){

       try {
          
          let created = (FileSystem.mkdirSync(`C:/Users/Maddox/nodeApps/Tutorgram/cdn/cdn/${this.file.username}`)) ? true : false;

          return {created : created};

       } catch(e) {
           // statements
           return {created : true};
       }

    }
}

exports.ask = class Ask extends Database {

    constructor(file){

        super();

       this.file = file;
       this.file.url = '';
       this.local = {};

       if(this.file.context == 1){

          let type = (this.file.type == 'video/mp4' || this.file.type == 'video/mkv') ? 'video' : 'image';
          this.local.sql = 'INSERT INTO posts VALUES(?, ?, ?, ?, ?, ?, ?)';
          this.local.data = [this.file.user_id, type, this.file.text, this.file.url, new Date(), 'hello', null];

       }else if(this.file.context == 2){

          let type = this.file.upload_type;

          this.local.sql = 'UPDATE user_images SET image_url = ? WHERE user_id = ? AND type = ?';
          this.local.data = [this.file.url, this.file.user_id, type];


       }

    }

    async prepare(){
        
        //this.file.name = (this.file.type == 'video/mp4' || this.file.type == 'video/mkv') ? `${fileName}.mp4` : `${fileName}.png`;

        this.file.url = `http://192.168.43.13:5000/cdn/${this.file.username}/${this.file.name}`;

         if(this.file.context == 1){
            this.local.data[3] = this.file.url;
        }else{
            this.local.data[0] = this.file.url;
        }


        this.file.newPath = `${this.file.newPath}\\cdn\\cdn\\${this.file.username}\\${this.file.name}`;

        const upload = new FileUpload(this.file);
        let m = upload.moveFile();

        return new Promise((resolve,reject) => {

            resolve({moved : true});

        });
        
    }

    async add(callback){

        let response = {};

        if((await this.prepare()).moved){

                let results = (await this.query(this.local.sql, this.local.data));

                console.log(results);

                if(results.affectedRows == 1){

                    response.uploaded = true;
                    response.insert = true;
                    response.error = false;
                    response.message = 'File Uploaded Successful';
                    response.ask = {};

                     if(this.file.context == 1){

                        response.ask.post = (await this.query('SELECT * FROM posts WHERE post_id = ?', [results.insertId]))[0];

                    }else{

                        response.upload = (await this.query('SELECT * FROM user_images WHERE user_id = ?', [this.file.user_id]));

                    }

                }else{
                    
                    response.uploaded = false;
                    response.insert = false;
                    response.error = true;
                    response.message = 'File Upload Unsuccessful';
                    response.ask = {};

                }

            }else{

                response.uploaded = false;
                response.insert = false;
                response.error = true;
                response.message = 'Moving File Failed Hard!';

            }

            callback(response);
 
    } // End Of Add

} // End Of Ask{}


exports.search = class Search extends Database {

    constructor(args){

        super();

        this.queryObj = args;

        if(this.queryObj.context == 1){

            this.queryObj.sql = 'SELECT user_id, username FROM users WHERE username LIKE ?';
            this.queryObj.data = [`${this.queryObj.q}%`];

        }

    }

    async get(callback){

        let rows = (await this.query(this.queryObj.sql, this.queryObj.data));

        let response = {};

        if(rows.length > 0){

            response.count = rows.length;
            response.found = [];
            response.message = 'Users Found!'

            for(let i = 0; i < rows.length; i++){
              console.log(rows[i]);
                let usr = new exports.user(1, rows[i].user_id, this.queryObj.user_id);

                let info = (await usr.info(null, false));

                response.found.push(info);

            }

            callback(response);

        }else {

            response.count = rows.length;
            response.found = [];
            response.message = 'No Users Found';

            callback(response);

        }

    } // End Of Get


} // End Of Search Definition

exports.tutors = class FindTutors extends Database {

        constructor(args){

            super();

            this.args = args;
            this.local = {};
            this.local.data = [`${this.args.location}%`, `${this.args.subject}%`];

        }
        // The Database Has To Have A Table To Hold All Tutors Info, Like {Rate, Location, Degrees, Real Name, Rating, Tutoring Subject}

        async getAll(viewId, callback){

            let rows = (await this.query('SELECT * FROM tutor WHERE location LIKE ? OR subject LIKE ?', this.local.data));
            
            if(rows.length > 0){

                this.local.info = [];
                for(let i = 0; i < rows.length; i++){

                   let user = new exports.user(1, rows[i].user_id, viewId);

                   this.local.info.push({

                      user : (await user.info(() => {}, false)),

                      tutor_info : rows[i]

                    }); // End Of Object

                } // End Of For Loop

                this.local.list = true;

            }else{

                this.local.list = false;

            } // End Of If

            callback(this.local);

        } // End Of GetAll

  } // End Of Database


  // 

  /*CREATE TABLE tutor(
    user_id int not null,
    price text not null,
    location text not null,
    subject text not null,
    qualification text not null,
    qualification_file_url text not null,
    rating text not null,
    tutor_id int not null PRIMARY KEY AUTO_INCREMENT
);*/

exports.beTutor = class RegisterTutor extends Database {

    constructor(args){

        super();

        this.args = args;
        this.local = {};

         if(this.args.context == 1){  // Register As Tutor

            this.local.sql = 'INSERT INTO tutor VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
            this.local.data = [this.args.user_id, this.args.price, this.args.location, this.args.subject, this.args.qualification, this.args.qualification_file_url, '', null];

         }

    } // End Of Costructor


    async insertTutor(callback){

        if((await this.query(this.local.sql, this.local.data)).affectedRows == 1){

            this.local.created = true;

            if((await this.query('UPDATE users SET account_type = ? WHERE user_id = ?', ['tutor', this.args.user_id])).affectedRows == 1){

                this.local.a_tutor = true;

            }else{

                this.local.a_tutor = false;

            }

        }else {

            this.local.created = false;

        }

        callback(this.local);

    } // End Of insertTutor

} // End Of Class


/*CREATE TABLE messages(
    user_one_id int not null,
    user_two_id int not null,
    message_text text not null,
    message_url text not null,
    message_date text not null,
    message_seen int not null,
    message_id int not null PRIMARY KEY AUTO_INCREMENT
);
*/
exports.messages = class Messages extends Database {

    constructor(args){

        super();

        this.args = args;
        this.local = {};

        if(this.args.context == 1 || this.args.context == 7){ // Sends Message

            this.local.sql = 'INSERT INTO messages VALUES(?, ?, ?, ?, ?, ?, ?)';
            this.local.data = [this.args.user_one_id, this.args.user_two_id, this.args.message_text, this.args.message_url, new Date(), 0, null];

            console.log(1);

        }else if(this.args.context == 2){ // Viewing Chats

            this.local.sql = 'SELECT * FROM temp_messages WHERE user_one_id = ? OR user_two_id = ?';

            this.local.data =  [this.args.user_one_id, this.args.user_one_id];

        }else if(this.args.context == 3){ // For Viewing Messages Between Two Particular People

            this.local.sql = 'SELECT * FROM messages WHERE user_one_id = ? AND user_two_id = ? OR user_one_id = ? AND user_two_id = ?';

            this.local.data =  [this.args.user_one_id, this.args.user_two_id, this.args.user_two_id, this.args.user_one_id];

        }

    } // End Of Constructor

    async getMessages(callback){

        let response = {};
        let rows = (await this.query(this.local.sql, this.local.data));

          if(rows.length > 0){

            response.messages = [];

            for(let i = 0; i < rows.length; i++){

                response.messages.push({

                    message_item : rows[i]

                });

            }

            response.list = true;

          }else{

            response.list = false;

          }

          callback(response);

    } // End Of getMessages()

    async viewChats(callback){

        let response = {};
        response.holder = [];

        let rows = (await this.query(this.local.sql, this.local.data));

          if(rows.length > 0){

            for(let i = 0; i < rows.length; i++){

            let user = null;

             if(this.args.user_id == rows[i].user_one_id){

                user = new exports.user(1, rows[i].user_two_id, this.args.user_id);
                console.log(2);

             }else{
                console.log(4);
                user = new exports.user(1, rows[i].user_one_id, this.args.user_id);

             }

             response.holder.push({
                  chat_info : (await user.info(() => {}, false)),
                  last_message : rows[i]
                });

             response.list = true;

           } // End Of For Loop

          }else{

            response.list = false;

          }

          callback(response);

    } // End Of viewChats

    async insertMessage(){

        let reply = {};

        if((await this.query('INSERT INTO temp_messages VALUES(?, ?, ?, ?)', [this.args.user_one_id, this.args.user_two_id, this.args.message_text, null])).affectedRows == 1){
            let insert = (await this.query(this.local.sql, this.local.data));

             if(insert.affectedRows == 1){
                reply.messages = [];
                    reply.messages.push(
                        {
                            message_item : (await this.query('SELECT * FROM messages WHERE message_id = ?', [insert.insertId]))[0]
                     });
                    reply.error = false;

              }else{

                reply.error = true;
                reply.message = "Message No Sent";
                reply.code = 1;

              }

        }else{

            reply.error = true;
            reply.message = "Message No Sent";
            reply.code = 2;
        }

        return new Promise((resolve, reject) => {

            //if(reply.error) reject({error : true, code : 56});
            resolve(reply);

        });

    } // End Of Insert

    async sendMessage(callback){

        let response = {};

        if((await this.query('SELECT * FROM temp_messages WHERE user_one_id = ? AND user_two_id = ? OR user_one_id = ? AND user_two_id = ?', [this.args.user_one_id, this.args.user_two_id, this.args.user_two_id, this.args.user_one_id])).length == 1){

            if((await this.query('DELETE FROM temp_messages WHERE user_one_id = ? AND user_two_id = ? OR user_one_id = ? AND user_two_id = ?', [this.args.user_one_id, this.args.user_two_id, this.args.user_two_id, this.args.user_one_id])).affectedRows == 1){

                response.reply = (await this.insertMessage());
                response.error = false;

            }else{

                response.error = true;
                response.message = "Message Not Sent";
                response.code = 3

            }

        }else{

            response.reply = (await this.insertMessage());
            response.error = false;

       }

       console.log(response);

        callback(response);

    } // Send Message

} // End Of Class



// Class Get All Bread Crumbs

exports.crumbs = class BreadCrumbs extends Database {

    constructor(args){

        super();

        this.args = args;

    }  // End Of Constructor

    async review(callback){

        let response = {};

       if((await this.query('SELECT * FROM reviews WHERE user_id = ? AND comment_id = ?', [this.args.user_id, this.args.comment_id])).length == 1){

          if((await this.query('DELETE FROM reviews WHERE user_id = ? AND comment_id = ?', [this.args.user_id, this.args.comment_id])).affectedRows == 1){

            response.error = false;
            response.votes = (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [this.args.comment_id, 'upvote'])).length - (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [this.args.comment_id, 'downvote'])).length;

          }else{

            response.error = true;

          }

       }else{

           if((await this.query('INSERT INTO reviews VALUES(?, ?, ?, ?)', [this.args.user_id, this.args.comment_id, this.args.type, null])).affectedRows == 1){

              response.error = false;
              response.votes = (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [this.args.comment_id, 'upvote'])).length - (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [this.args.comment_id, 'downvote'])).length;

           }else{

            response.error = true;

           }

       }

       callback(response);

    }

    async requests(callback){

        let response = {};
        let rows = (await this.query('SELECT * FROM requests WHERE user_id = ? AND tutor_id = ?', [this.args.user_id, this.tutor_id]));

          if(rows.length == 1){

               if((await this.query('DELETE FROM requests WHERE user_id = ? AND tutor_id = ?', [this.args.user_id, this.args.tutor_id])).affectedRows == 1){

                  if((await this.query('INSERT INTO requests VALUES(?, ?, ?, ?)', [this.args.user_id, this.args.tutor_id, 'Requested', null])).affectedRows == 1){


                    response.requested = true;
                    response.message = "Requested";


                  }else{

                    response.requested = false;
                    response.message = "This Tutor Cannot Be Requested At This Moment";

                  }

               }else {
                   
                   response.requested = false;
                   response.message = "Failed To Request Tutor";

               }

          }else if(rows.length < 1){

            if((await this.query('INSERT INTO requests VALUES(?, ?, ?, ?)', [this.args.user_id, this.args.tutor_id,
                    'Requested', null])).affectedRows == 1){


                    response.requested = true;
                    response.message = "Requested";


                  }else{

                    response.requested = false;
                    response.message = "This Tutor Cannot Be Requested At This Moment";

                  }


          }

          callback(response);

    }   // End Of Requests

}  // End Of BreadCrumbs


exports.notifications = class Notifications extends Database {

    constructor(args){

        super();

        this.args = args;

       /* if(this.args.context == 1){

           await this.addLikeNotification();

        }else if(this.args.context == 2){

            // Show Notifications Of Logged In User


        }  // End Of Context Checking*/

    } // End Of Constructor

    async userNotifications(callback){

        let reply = {};

        let rows = (await this.query('SELECT * FROM notifications WHERE user_id = ?', [this.args.user_id]));

        if(rows.length > 0){

            // Has Notifications

            reply.list = true;
            reply.message = 'User Has Notifications';
            reply.notifications = [];

            for(let i = 0; i < rows.length; i++){

                let user = new exports.user(1, rows[i].viewer_id, rows[i].user_id);
                let info = {

                    notif_item : rows[i],
                    user : (await user.info(() => {}, false))

                }
                info.post = (await this.query('SELECT * FROM posts WHERE post_id = ?', [rows[i].post_id]))[0];
                info.post_data = {

                    liked : ((await this.query('SELECT like_id FROM post_likes WHERE user_id = ? AND post_id = ?', [rows[i].viewer_id, rows[i].post_id])).length == 1) ? true : false,

                    num_of_likes : (await this.query('SELECT like_id FROM post_likes WHERE post_id = ?', [rows[i].post_id])).length,

                    num_of_comments : (await this.query('SELECT comment_id FROM comments WHERE post_id = ?', [rows[i].post_id])).length

                }
                
                reply.notifications.push(info);

            } // End Of Loop

        }else{

            // No Notifications

            reply.message = 'User Has No Notifications';

        }

        callback(reply);

    } // End Of userNotification

    async addNotification(callback){

        let reply = {};

        let row = (await this.query('SELECT notif_id FROM notifications WHERE user_id = ? AND viewer_id = ? AND post_id = ? AND type = ?', [this.args.user_id, this.args.viewer_id, this.args.post_id, this.args.type]));

        if(row.length > 0){

            // DELETE This Notification

            if((await this.query('DELETE FROM notifications WHERE user_id = ? AND viewer_id = ? AND post_id = ? AND type = ?', [this.args.user_id, this.args.viewer_id, this.args.post_id, this.args.type])).affectedRows == 1){

                reply.error = false;

            }else{

                reply.error = true;

            }

        }else{

            if((await this.query('INSERT INTO notifications VALUES(?, ?, ?, ?, ?)', [this.args.viewer_id, this.args.user_id, this.args.post_id, this.args.type, null])).affectedRows == 1){

                reply.error = false;

            }else{

                reply.error = true;

            }

        }

        callback(reply); // Callback

    } // End Of addLikeNotification

    async insertInto(callback){

        let reply = {};

        if((await this.query('INSERT INTO notifications VALUES(?, ?, ?, ?, ?)', [this.args.viewer_id, this.args.user_id, this.args.post_id, this.args.type, null])).affectedRows == 1){

                reply.error = false;

            }else{

                reply.error = true;

            }

            callback(reply);

    }


} // End Of Notification

/*
   user_id int not null,
    post_id int not null,
    comment_type text not null,
    comment_text text not null,
    comment_url text not null,
    comment_date text not null,
    comment_id int not null PRIMARY KEY AUTO_INCREMENTs
*/

exports.comment = class Comment extends Database {

    constructor(args){

        super(); // Clark Kent!

        this.args = args;

        if(this.args.context == 1){

            this.args.sql = 'INSERT INTO comments VALUES(?, ?, ?, ?, ?, ?, ?)';

            this.args.data = [this.args.user_id, this.args.post_id, this.args.type, this.args.comment_text, this.args.comment_url, new Date(), null];

        }else if(this.args.context == 2){

            this.args.sql = 'SELECT * FROM comments WHERE post_id = ?';
            this.args.data = [this.args.post_id];

        }

    }

    async getComments(viewId,callback){

        let response = {};

        let rows = (await this.query(this.args.sql, this.args.data));

        if(rows.length > 0){

            response.list = true;
            response.comments = [];

            for(let i = 0; i < rows.length; i++){

                let user = new exports.user(1, rows[i].user_id, viewId);

                response.comments.push({

                    comment : rows[i],
                    user : (await user.info(() => {}, false)),
                    comment_data : {

                        votes : (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [rows[i].comment_id, 'upvote'])).length - (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND type = ?', [rows[i].comment_id, 'downvote'])).length,
                        yours : (await this.query('SELECT * FROM reviews WHERE comment_id = ? AND user_id = ?', [rows[i].comment_id, viewId])).length == 1 ? 'true' : 'false'
                    
                    }

                });            

           }

        }else{

            response.list = false;


        }

        callback(response);

    }

    async addCommentNotification(callback){

        // [this.args.user_id, this.args.viewer_id, this.args.post_id, this.args.type]

        let user_id = (await this.query('SELECT * FROM posts WHERE post_id = ?', [this.args.post_id]))[0].user_id;

        let notification = new exports.notifications({
            viewer_id : this.args.user_id,
            user_id : user_id,
            post_id : this.args.post_id,
            type : 'comment'
        });

        notification.insertInto((reply) => {
            callback();
        });

    }

    async addComment(callback){

        let response = {};

        let result = (await this.query(this.args.sql, this.args.data));

          if(result.affectedRows == 1){
            // After The Comment Is Added Successfully, Return The Comment To Be Added As Part Of Front End

             let com = (await this.query('SELECT * FROM comments WHERE comment_id = ?', [result.insertId]));

               if(com.length == 1){

                  response.comments = [];

                  let user = new exports.user(1, this.args.user_id, 0)

                  response.comments.push({

                    comment : com[0],
                    user : (await user.info(() => {}, false)),
                    comment_data : {
                        votes : 0,
                        yours : false
                    }

                  });

                  response.error = false;
                  response.message = 'Comment Added Successfully';

               }else{

                  response.error = true;
                  response.message = 'Comment Could Not Be Added';

               }

          }else{

            response.error = true;
            response.message = 'Adding The Comment Was Not Even Attempted!';

          }

          await this.addCommentNotification(() => {});

          callback(response);

    } // End Of addComment

} // End Of Class



