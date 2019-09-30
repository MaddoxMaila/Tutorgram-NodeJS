const mysql = require('mysql');


class Database{

    constructor(){

        this.connection = mysql.createConnection({
            host : "localhost",
            password : "mysql",
            user : "root",
            database : "tutorgram"
        });
        
        this.connection.connect(
            (error) => {

                if(error) throw error;

                console.log("Connected!!");

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

}

exports.login = class UserLogin extends Database {

    constructor(email, password){

        this.credentials = [email, password];

    }

    async getUser(){

        try{

            let x = await this.query("SELECT username, email, date_creation, userId FROM users WHERE email = ? AND password = ?", this.credentials);
            console.log(x);
        }catch (error){

            console.log(error);

        }

    }

}

exports.user = class User extends Database{

    constructor(context, userId, viewerId){

        this.args = {
            context : context,
            user_id : userId,
            view_id : viewerId,
        }
        
    }
}
