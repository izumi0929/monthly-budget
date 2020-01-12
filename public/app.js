  
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyAvqDHNMJCnTm7RmqoQ3ClRbGOc99wa8ZM",
  authDomain: "monthly-expense-calendar.firebaseapp.com",
  databaseURL: "https://monthly-expense-calendar.firebaseio.com/",
  storageBucket: "monthly-expense-calendar.appspot.com"
};

console.log(firebase.apps.length)
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Get a reference to the database service
var database = firebase.database();

//Elementの取得
const preObject = document.getElementById('object')

//Referenceの作成
const dbRefObject = firebase.database().ref().child('expenses')

//Objectの変化と同期
dbRefObject.on('value', snap => 
  preObject.innerText = JSON.stringify(snap.val(), null, 3)
)

//set data
function writeExpenseData(date, expense, type) {
  firebase.database().ref('expenses').push({
    'date': date,
    'type': type,
    'expense': expense
  })
}