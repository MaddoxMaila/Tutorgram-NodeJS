/*
   
   Javascript Frame To Make Coding In Javascript Easier

*/

  
  // Class To Handle All Network Connections
  class Http {

    // Define Class Constructor
    __constructor(){

      this.xhr = null;
      this.form = null;
      this.url = null;
      this.method = null;

    } // End OF Constructor


    // Method For Setting Class Variables
    set(method, url, form){

      this.method = method;
      this.url = url;
      this.form = form;
      this.xhr = new XMLHttpRequest();

      return this;
    } // End Of Set

    progressbar(bar_props){

      var progress = 0;
      this.xhr.upload.onprogress = (e) => {

        var done = e.position || e.loaded, total = e.totalSize || e.total;

        progress =(Math.floor(done / total * 1000) / 10 );

        DOM.get(bar_props[0]).style.display = 'block';
        
        DOM.get(bar_props[1]).style.width = `${progress}%`;

        DOM.html(bar_props[2], `${progress}%`);

        if(progress == 100){

          DOM.html(bar_props[2],`${progress}% COMPLETE!!`);

        }

        console.log(progress);
          
      } // End Of Arrow Function

    } // End Of ProgressBar

    // Method For Sending The Actual Request, Accepts A Callback Function And A Tag For Progress Bar
    request(callback, args){

      var self = this;

      // Handle Error That May Arise
       try {
         
         self.xhr.onreadystatechange = () => {

            if(self.xhr.readyState == 4 && self.xhr.status == 200){

               callback(JSON.parse(self.xhr.responseText));

            } // End Of If

         } // End Of Arrow Function

         if(args.need_progress_bar){

           self.progressbar(args.bar);

         }

         self.xhr.open(self.method, self.url, true);
         self.xhr.send(self.form);

       } catch(e) {

         // statements
         console.log(e);

       } // End OF Try-Catch

    } // End Of Request Method

  } // End Of Class

  // Class To Easily Access And Create HTML Tags With Added Attributes In Javascript

  class Element{

    // Class Constructor
    __constructor(dom){

      this.dom = dom;

    } // End Of Constructor

    // For Getting An Element
    get(identifiier){

      return document.querySelector(identifiier);

    } // End Of get()

    // For Getting Elements Of The Same Identifier
    gets(identifier){

       return document.querySelectorAll(identifier);

    } // End Of gets()

    // Gets Value Of A Field
    val(identifier){

       return document.get(identifier).value;

    } // End Of val()

    // For Writing Inside HTML tags
    html(identifier, content){
         
       this.get(identifier).innerHTML = content;

    } // End Of html()

      loader(){

      let center = this.create('center', '');
      let Loader = this.create('div', 'app-loader');

      center.appendChild(Loader);

      return center;

    } // End Of Loader

    toast(str){

      this.get('.toast-text').textContent = str;
      this.get('.app-toast').style.display = 'block';

      // Clear The Toast After 3000ms, 1000ms = 1s
      setTimeout(

        () => {

        this.get('.app-toast').style.display = 'none';
        
      }, 
      4000);

    } // End of toast()

    // For Creating Element And Its Class
    create(name, classes){

       let Tag = document.createElement(name);

       Tag.setAttribute('class', classes);

       return Tag;

    } // End Of element()
  } // End Of Class


  const HTTP = new Http();
  const DOM = new Element(document);