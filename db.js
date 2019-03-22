//some sample data
const guestData = [
   { fn: "Andy", ln: "Siemer", email: "andy@cool.com", notes: "Hey there." },
];

//the database reference
let db;

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("guests", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);
	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath: "email"});
      
      for (var i in guestData) {
         objectStore.add(guestData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
	//get a reference to the fields in html
	let fn = document.querySelector("#firstname").value;
	let ln = document.querySelector("#lastname").value;
	let email = document.querySelector("#email").value;
	let notes = document.querySelector("#notes").value;

	//alert(id + name + email + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction(["guest"], "readwrite")
	.objectStore("guest")
	.add({ fn: fn, ln: ln, email: email, notes: notes });

   //when successfully added to the database
	request.onsuccess = function(event) {
		alert(`${email} has been added to your database.`);
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`Unable to add data\r\n${email} is already in your database! `);
	}

	readAll();
}

 function readAll() {
     clearList();
     
    var objectStore = db.transaction("guest").objectStore("guest");
    
    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       
       if (cursor) {
          console.log("First Name: " + cursor.value.fn + ", Email: " + cursor.value.email);
          addEntry(cursor.value.fn, cursor.value.ln, cursor.value.email, cursor.value.notes);
          cursor.continue();
       }
       
       else {
          console.log("No more entries!");
       }
    };
 }

function addEntry(fn, ln, email, notes) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'entry';
    iDiv.innerHTML = fn + " " + ln + " " + email + "<BR>" + notes + "<HR>";
    document.querySelector("#entries").appendChild(iDiv);
 }
 function clearList() {
     document.querySelector("#entries").innerHTML = "";
 }

 initDatabase();