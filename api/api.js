const mysql = require('mysql');


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

        })

    }

}

exports.login = class UserLogin extends Database {

    constructor(email, password){

        super();
        this.credentials = [email, password];
        this.response = {};

    }

    async accessor(Callback){

        try{

            let results = await this.query('SELECT username, email, account_type, account_date, user_id FROM users WHERE email =? AND user_pass = ?', this.credentials);
            if(results.length === 1){
                // This Credentials Are Correct, Log User In
                this.response =  {
                    error : false,
                    logged : true,
                    user: results[0]
                };

            }else if(results.length <= 0 || results.length > 0){

                this.response =  {
                    error : false,
                    logged : false,
                    message : "Login Unsuccessful, Check Your Login Details To Check If They Are Correct"
                }

            }

            Callback(this.response);

        }catch (error){

            console.log(error);

        }

    }

} // End Of Class Login Definition

let login = new exports.login("madd@gmail", "maddox");
login.accessor((data)=>{
   console.log(data);
});

exports.user = class User extends Database{

    constructor(context, userId, viewerId = 0){

        super();

        this.args = {

            context : context,
            user_id : userId,
            view_id : viewerId,
            p_picture : 'profile_picture',
            c_picture : 'cover_picture'

        }; // End Of Class Object
        
    } // End Of Constructor

    async getUserInteration(){

        try {

            let totalPosts = textPosts = imgsPosts = videoPosts = [];

        totalPosts = await this.query('SELECT type,post_id FROM posts WHERE user_id = ?', [this.args.user_id]);// Get Number Of Posts This User Has Posted

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

          return {

            num_of_posts : totalPosts.length,
            text_posts : textPosts.length,
            image_posts : imgsPosts.length,
            video_posts : videoPosts.length

          }; // Get Object
            
        } catch (error) {
            
            console.log(error);

        }

    } // End Of getUserInteration

    // Organise The User Data Collected And Return It

    async formatter(callback){

        callback(
            {

            }
        ); // End Of callback function

    } // End Of Formatter

    async getUserInfo(){

        try {

            return {

                user : await this.query('SELECT username, email, account_type, account_date, user_id FROM users WHERE user_id = ?', [this.args.user_id])[0], // Get Basic User Information
                bio : await this.query('SELECT * FROM bio WHERE user_id = ?', [this.args.user_id])[0], // Get            Additional Info
    
                profile_picture : await this.query('SELECT image_url FROM user_images WHERE user_id = ?', [this.args.user_id, this.args.p_picture])[0], // Get User Profile Picture
    
                cover_picture : await this.query('SELECT img_url FROM user_images WHERE user_id = ? AND type = ?', [this.args.user_id, this.args.c_picture])[0], // Get User PRofile Cover Picture
    
            }; // End Of Object

        } catch (error) {
           
            console.log(error);
          
        }

    } // End Of getAdditionalInfo

    async getFollowers(){
         
          return {

              num_of_followers : await this.query('SELECT follow_id FROM follow WHERE user_two_id = ?', [this.args.user_id]).length, // Get Number Of Followers Following This User

              num_of_following : await this.query('SELECT follow_id FROM follow WHERE user_one_id = ?', [this.args.user_id]).length, // Get Number Of Users This User Is Following

              isFollowing : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.args.user_id, this.args.view_id]).length == 1) ? true : false, // Is This User Following Viewer?

              isFollower : (await this.query('SELECT follow_id FROM follow WHERE user_one_id = ? AND user_two_id = ?', [this.args.view_id, this.args.user_id]).length == 1) ? true : false // Is This Viewer Following User

          }; // End Of Object

    } // End Of getFollowers

} // End Of Class Def

 // This Following Class Is Used To Return Both Posts And Comments To A Post 

exports.posts = class posts extends Database{

    constructor(cxt, userId = 0, postId = 0){

        this.args = {};
        this.args.context = cxt;

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

                    num_of_likes : await this.query('SELECT like_id FROM likes WHERE post_id = ?', [row.post_id]).length,

                    num_of_comments : await this.query('SELECT p_id comments WHERE post_id =?', [row.post_id]).length,

                },

                user : await User.formatter(),



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
