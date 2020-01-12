// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyAvqDHNMJCnTm7RmqoQ3ClRbGOc99wa8ZM",
  authDomain: "monthly-expense-calendar.firebaseapp.com",
  databaseURL: "https://monthly-expense-calendar.firebaseio.com/",
  storageBucket: "monthly-expense-calendar.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//Elementの取得
const preObject = document.getElementById('object')

//Referenceの作成
const dbRefObject = firebase.databse().ref().child('object')

//Objectの変化と同期
dbRefObject.onclick('value', snap => console.log(snap.val()))


function makeTable (data, tableId) {
  let rows = []
  let calendarTable = document.createElement("table")
  for (i=0; i < data.length; i++){
    rows.push(calendarTable.insertRow(-1))
    for (j=0; j < data[0].length; j++){
      cell=rows[i].insertCell(-1)
      cell.appendChild(document.createTextNode(data[i][j]))
      cell.style.width = "5em"
      cell.style.height = "3em"
      cell.style.textAlign = "center"
      cell.onclick = function() {
        // alert("You clicked" + currentYear + '/' + (currentMonth+1)+ '/' + this.textContent)
        selectedDate = this.textContent
        makeExpenseTitle(selectedDate)
      };
      if(i==0){
        cell.style.backgroundColor = "#bbb"; // ヘッダ行
      }else if(j%7==6){
        cell.style.color = "#4682B4"
        cell.style.backgroundColor = "#ddd"
      }else if(j%7==0){
        cell.style.color = "#FFA07A"
        cell.style.backgroundColor = "#ddd"
      }else{
        cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
      }
    }
  }
  document.getElementById(tableId).appendChild(calendarTable)
}

function makeYYYYMM(year, month, monthId) {
  var yyyydd = year + '/' + (month+1) + "月"
  document.getElementById(monthId).innerHTML = yyyydd
}

const date = new Date()
let currentYear = date.getFullYear()
let currentMonth = date.getMonth()

window.addEventListener("load", makeCalendar(currentYear, currentMonth))

function makeCalendar(year, month) {
let startDate = new Date(year, month, 1)
let endDate = new Date(year, month+1, 0)
const startDay = startDate.getDay()
const endDay = endDate.getDay()
let data = [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]]
let dates =[]
for (dateIndex = 1; dateIndex <= endDate.getDate(); dateIndex++ ){
  dates.push(dateIndex)
}
for (i = 0; i < startDay; i++){
  dates.unshift('')
}
const firstWeek = dates.slice(0,7)
const secondWeek = dates.slice(7,14)
const thirdWeek = dates.slice(14,21)
const fourthWeek = dates.slice(21,28)
const fifthWeek = dates.slice(28,36)
for (i = 0; i < 6 - endDay; i++){
  fifthWeek.push('')
}

data.push(firstWeek)
data.push(secondWeek)
data.push(thirdWeek)
data.push(fourthWeek)
data.push(fifthWeek)
makeTable(data,"table")
makeYYYYMM(year, month, "month")
}

window.addEventListener("load", makeExpenseTitle())
function makeExpenseTitle(selectedDate = date.getDate() ){
  document.getElementById("expenseTitle").innerHTML = selectedDate + "日の出費"
}

function addExpense(){
  let p = document.createElement("p")
  document.getElementById("expenses").appendChild(p).innerHTML = document.getElementById("expense").value
}


// TODO: 一つにする
function showPreviousMonth() {
  // delete calendar before make new one
  document.getElementById("table").textContent = null
  currentMonth--
  if (currentMonth < 0){
    currentYear--
    currentMonth = 11
  }
  this.makeCalendar(currentYear, currentMonth)
}

function showNextMonth() {
  // delete calendar before make new one
  document.getElementById("table").textContent = null
  currentMonth++
  if (currentMonth > 11) {
    currentYear++
    currentMonth = 0
  }
  console.log(currentMonth)
  this.makeCalendar(currentYear, currentMonth)
}