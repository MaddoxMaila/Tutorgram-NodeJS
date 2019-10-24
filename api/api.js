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

        this.images = [0, "http://localhost:5000/cdn/images/default.png", "profile", null];
        this.covers = [0, "http://localhost:5000/cdn/images/cover.png", "cover", null];

                          // [0, "http://localhost:5000/cdn/images/default_cover.png", "cover", null]

                    

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
    
                isFollower : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.args.view_id, this.args.user_id])).length == 1 ? true : false // Is This Viewer Following User
    
            };

            return new Promise((resolve, reject) => {

                resolve(userFollows);

            });
    
        } catch (error) {

            console(error);
            
        }

    } // End Of getFollowers

} // End Of Class Def



 // This Following Class Is Used To Return Both Posts And Comments To A Post 

exports.posts = class post extends Database{

    constructor(cxt, userId = 0, postId = 0){

        super();

        this.args = {

            context : cxt

        };

        if(this.args.context == 1){

            this.args.sql = 'SELECT * FROM posts';

        }else if(this.args.context == 2){

            this.args.sql = 'SELECT * FROM posts WHERE user_id = ?';

            this.args.user_id = userId;

        }else if(this.args.context == 3){

            this.args.sql = 'SELECT * FROM comments WHERE post_id = ?';

            this.args.post_id = postId;

        }

        this.response = {};

    } // End Of Constructor

    async getPosts(viewerId, callback){

        try {

            this.response.posts = [];

            let rows = await this.query(this.args.sql, [this.args.post_id]);

            for(let i = 0; i < rows.length; i++) {

              let User = new exports.user(this.args.context, row.user_id, viewerId);

              let postData = {

                post : row,

                post_data : {

                    num_of_likes : (await this.query('SELECT like_id FROM post_likes WHERE post_id = ?', [row.post_id])).length,

                    num_of_comments : (await this.query('SELECT comment_id comments WHERE post_id =?', [row.post_id])).length,

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

          callback(resp);

    } // End Of Follow User

} // End Of Follows


exports.react = class Reaction extends Database {

    constructor(fields){

        this.args = fields;

        if(this.args.context == 1){

            this.args.sql = 'SELECT like_id FROM post_likes WHERE user_id = ? AND post_id = ?';
            this.args.data = [this.args.user_id, this.args.post_id];

        }

    }  // End OF Constructor

    async like(callback){

        let local = {};

        let rows = (await this.query(this.args.sql, this.args.data));

          if(rows.length == 0){   // User Is Liking


               local.message = ((await this.query('INSERT INTO post_likes VALUES(?, ?, ?)', [this.args.user_id, this.args.post_id, null])).affectedRows == 1) ? 'Liked' : 'Like Error';


          }else{                  // User Is Unliking

               local.message = ((await this.query('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', [this.args.data])).affectedRows == 1) ? 'Unliked' : 'Unlike Error';

          }

          local.count = (await this.query('SELECT like_id FROM post_likes WHERE post_id = ?', [this.args.post_id])).length;

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

       let type = (this.file.type == 'video/mp4' || this.file.type == 'video/mkv') ? 'video' : 'image';

       this.local = {};
       this.local.sql = 'INSERT INTO posts VALUES(?, ?, ?, ?, ?, ?, ?)';
       this.local.data = [this.file.user_id, type, this.file.text, this.file.url, new Date(), 'hello', null];

    }

    async prepare(){
        
        //this.file.name = (this.file.type == 'video/mp4' || this.file.type == 'video/mkv') ? `${fileName}.mp4` : `${fileName}.png`;

        this.file.url = `http://localhost:5000/cdn/${this.file.username}/${this.file.name}`;

        this.local.data[3] = this.file.url;


        this.file.newPath = `${this.file.newPath}\\cdn\\cdn\\${this.file.username}\\${this.file.name}`;

        console.log(this.file);

        const upload = new FileUpload(this.file);
        let m = upload.moveFile();
        if(m.moved){
            console.log('Console Moved!');
        }else{
            console.log('Console Not Moved!!' + m.error);
        }

        return new Promise((resolve,reject) => {

            resolve({moved : true});

        });
        
    }

    async add(callback){

        let response = {};

        if((await this.prepare()).moved){

                let results = (await this.query(this.local.sql, this.local.data));

                if(results.affectedRows == 1){

                    response.uploaded = true;
                    response.insert = true;
                    response.error = false;
                    response.message = 'File Uploaded Successful';
                    response.ask = {};

                    response.ask.post = (await this.query('SELECT * FROM posts WHERE post_id = ?', [results.insertId]))[0];

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

                let usr = new exports.user(rows[0].user_id, this.queryObj.user_id);

                let info = (await usr.info(null, false));

                response.found.push(info);

                callback(response);


            }

        }else {

            response.count = rows.length;
            response.found = [];
            response.message = 'No Users Found';

            callback(response);

        }

    } // End Of Get


} // End Of Search Definition

