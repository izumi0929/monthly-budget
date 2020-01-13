  
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyAvqDHNMJCnTm7RmqoQ3ClRbGOc99wa8ZM",
  authDomain: "monthly-expense-calendar.firebaseapp.com",
  databaseURL: "https://monthly-expense-calendar.firebaseio.com/",
  storageBucket: "monthly-expense-calendar.appspot.com"
}

console.log(firebase.apps.length)
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Get a reference to the database service
let database = firebase.database();

//Elementの取得
const preObject = document.getElementById('expenses')
const totalExpenseObject = document.getElementById('totalExpense')

//Referenceの作成
let dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+currentMonth+1+"-"+currentDate)

// set selected YMD

// Objectの変化と同期
dbRefObject.on('child_added', function setExpenses(snap) {
  let selectedDateExpenses = snap.val()
  preObject.innerHTML +=  selectedDateExpenses.expense + "円<br>"
})

//set data
function writeExpenseData(date, expense, purpose, item) {
  firebase.database().ref('expenses/' + date).push(
    {
      'purpose': purpose,
      'expense': expense,
      'item': item
    }
  )
}