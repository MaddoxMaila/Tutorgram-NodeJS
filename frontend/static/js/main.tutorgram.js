
let isLogged = (localStorage.getItem('id') != null) ? {

	session : true, 
	id : localStorage.getItem('id'), 
	username : localStorage.getItem('username')

} : {

	session : false, 
	id : 0, 
	username : 'Guest'

};
 
const isMobile = (screen.width > 650) ? false : true;           // Check If Tutorgram Is Accessed Through A Desktop Or Mobile

const bar = {need_progress_bar : false};                        // Object To Check Who Is Logged And Whos Not

// HTTP.set('GET', '/session', null).request((resp) => {
//                                                 // Get Session Of LoggedIn USer From Server
// }, {need_progress_bar : false});


/*
 
 ## Class To Auto Generate HTML Content Dynamically And Also For Code Re-Use To Avoid Redundancies

*/
class UserInterface extends Element{

	constructor(){

		super(document);

	}

	 followBtn(args, callback){

	 	  let button = this.create('a', 'btn btn-default');           // Create The Button

	 	  button.textContent = args.text;

	 	  button.onclick = () => {

	 	  	 let form = new FormData();

	 	  	 form.append('context', 1);
	 	  	 form.append('user_one_id', args.user_id);
	 	  	 form.append('user_two_id', args.follow_user_id);

	 	  	 HTTP.set('POST', '/api/follow', form).request((data) => {

	 	  	 	  button.textContent = data.message;                     // Change Button Message From Either Follow/ Following
	 	  	 	  callback(data);                                        // Callback To Implement At Button Context

	 	  	 }, bar);

	 	  }                                                            // End Of Button Click

	 	  if(args.center){

	 	  	let center = this.create('center', '');
	 	    center.append(button);

	 	    return center;// Return Centered Button To Append On HTML

	 	  }else{

	 	  	return button;

	 	  }
	 	               

	 	  

	 }                                                               // End Of FollowBtn

	 mediaBundle(args){                                              // {position :'', img : true|false, height : '', width :''}

	 	   let Media = this.create('div', 'media container-fluid');
	 	   let MediaPosition = this.create('div', args.position);
	 	   let MediaBody = this.create('div', 'media-body');

	 	   Media.append(MediaPosition);
	 	   Media.append(MediaBody);

	 	   if(args.img){

	 	   	  let Img = new Image();
	 	   	  Img.src = args.src;

	 	   	  Img.setAttribute('height', args.height);
	 	   	  Img.setAttribute('width', args.width);

	 	   	  MediaPosition.append(Img);

	 	   }

	 	   return [Media, MediaPosition, MediaBody];

	 }

	 showFollows(btn, args){

	 	  let button = btn;

	 	  button.onclick = () => {

	 	  	let textCon = (args.context == 2) ? 'Followers' : 'Following';

	 	  	DOM.html('.tg-viewport', '');
	 	  	let form = new FormData();

	 	    form.append('context', args.context);
	 	    form.append('user_one_id', args.logged_id);
	 	    form.append('user_two_id', args.user_id);

	 	    HTTP.set('POST', '/api/follow', form).request((resp) => {

	 	    	  if(resp.count == 0){

	 	    	  	  DOM.get('.tg-viewport').append(this.center(this.span({class : 'tg-max-text', text : `${args.name} Has No ${textCon}`})));

	 	    	  }else{

	 	    	  	  resp.users.forEach((user) => {
	 	    	  	  	 console.log(user.usr);

	 	    	  	  	 DOM.get(args.view).append(this.userProfileCard(user.usr));
	 	    	  	  	 DOM.get(args.view).append(this.create('div', 'tg-space-small'));

	 	    	  	  });

	 	    	  	  this.grid({view : '.tg-viewport', items : '.tg-profile-card', width : 40, gutter : 1});

	 	    	  }

	 	    }, bar);

	 	  }


	 } // End Of Follows

	 userProfileCard(user){

	 	    let userCardWrapper = this.create('div', 'tg-profile-card');

	 	    let media = this.mediaBundle({position : 'media-left media-middle', img : true, src : user.user_info.profile_picture.image_url, heigt : 60, width : 60});


	 	    userCardWrapper.append(media[0]);

	 	    let anchor = this.create('a', 'tg-anchor-profile');
	 	    anchor.href = `/user/${user.user_info.user.username}`;
	 	    anchor.append(this.span({class : 'tg-bold-text', text : user.user_info.user.username}));

	 	    media[2].append(anchor);

	 	    let bottomBody = this.create('div', 'inherit container-fluid');

	 	    //bottomBody.append(this.span({class : 'tg-grey-text glypho', text : user.user_stats.num_of_followers}));

	 	    userCardWrapper.append(bottomBody);

	 	    media[2].append(this.followBtn({

	 	    	 text : (user.user_stats.isFollower) ? 'Follow' : 'UnFollow',
           user_id : isLogged.id,
           follow_user_id : user.user_info.user.user_id,
           center : false

	 	    }, (data) => {



	 	    }));


	 	    return userCardWrapper;

	 }

	 grid(args){

	 	 var elem = DOM.get(args.view);
     var msnry = new Masonry( elem, {
                // options
       itemSelector: args.items,
       columnWidth: args.width,
       horizontalOrder: true,
       stagger: 40
     });

	 }


	 popOut(button, callback){

	 	   let modal = this.get('.app-block-popout');

	 	   button.onclick = () => {

	 	   	  modal.style.display = 'block';

	 	   	  DOM.get('.close-btn').onclick = () => {

	 	   	  	modal.style.display = 'none';

	 	   	  }

	 	   }

	 	   callback({main_view : modal, content_view : '.app-block-popout-content', view : '.app-modal-view'});

	 }

	 fetch(args, callback){

	 	  HTTP.set(args.method, args.url, args.form).request((response) => {

	 	  	callback(response);

	 	  }, args.bar);

	 }


}


const ui = new UserInterface();
