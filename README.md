# Tutorgram-NodeJS
Sefako Makgatho University Group 5's Final Year Project. 
       
       
    Team : 1 Kamogelo Mashike
           2 Themba Makamu
           3 Philisiwe Masilela
           4 Tshepang Maila
       
Tutorgram Is To Serve Students And Tutors Alike, Students Can Ask Academic Questions And Other Students Including Tutors Can Provide Answers.
Answers Will Be In The Form Of Comments, These Answers Provided Will Be Assesed By Tutors And Students Again And Rated/Reviewed/Upvoted If Deemed Correct.
Students Can Request Tutoring Services From Tutors, Whilst Tutors Can Advertise Their Services On The Site. A Tutor Can Also Create Virtual Classes On The System
Specifically Offering Services To Paying Students!

This Repository Is For The Codebase Of Tutorgram

# Files To Start With :
      -> Tutorgram-NodeJS/tutorgram.js
      -> Tutorgram-NodeJS/api/api.js

#   Tutorgram-NodeJS/tutorgram.js

This File Is The Entry Point Of The System. tutorgram.js Has Two Parts, Routes For Serving HTML Files For The Web & The API routes That Serve Data To The Web And Other Interfaces That Need The Data Operate Like Mobile App, Desktop App
    
# 1. Web Page Routes

           #Home : '/home/'
           #Login : '/login/'
           #Signup : '/signup/'
           #Profile : '/user/:username/'
  
# 2. API Routes

   $route = '/api/'
   
       #Login : 'api/login'
              Returns {error: '', 'message', user : {Logged In User Data}}
              
       #User Profile : '/api/:username'
              Returns {user : user_info :{ bio : {}, profile_pic : {}}}
              
       #Follow : $route.'/follow/'
       #



#   
