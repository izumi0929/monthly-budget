const date = new Date()
let currentDate = date.getDate()
let currentYear = date.getFullYear()
let currentMonth = date.getMonth()
let currentYMD = currentYear+"-"+Number(currentMonth+1)+"-"+currentDate

//qa
// var config = {
//   apiKey: "AIzaSyAvqDHNMJCnTm7RmqoQ3ClRbGOc99wa8ZM",
//   authDomain: "monthly-expense-calendar.firebaseapp.com",
//   databaseURL: "https://monthly-expense-calendar.firebaseio.com/",
//   storageBucket: "monthly-expense-calendar.appspot.com"
// }

//dev
const firebaseConfig = {
  apiKey: "AIzaSyDWQ9ZTb4ptjOmL6eentJudr9WW8acOMBs",
  authDomain: "monthly-expense-calendar-f49f3.firebaseapp.com",
  databaseURL: "https://monthly-expense-calendar-f49f3.firebaseio.com",
  projectId: "monthly-expense-calendar-f49f3",
  storageBucket: "monthly-expense-calendar-f49f3.appspot.com",
  messagingSenderId: "818718623155",
  appId: "1:818718623155:web:56244da4e2064bdb9df7c6",
  measurementId: "G-6YGR3ECTWX"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get a reference to the database service
let database = firebase.database();

//Elementの取得
const preObject = document.getElementById('expenses')
const totalExpenseObject = document.getElementById('totalExpense')


//Referenceの作成
let dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate)

function makeTable (data, tableId) {
  let rows = []
  let calendarTable = document.createElement("table")
  for (i=0; i < data.length; i++){
    rows.push(calendarTable.insertRow(-1))
    for (j=0; j < data[0].length; j++){
      cell=rows[i].insertCell(-1)
      let cellElement = data[i][j]
      if (i != 0 && !!cellElement ) {
        cellElement = ("0" + cellElement).slice(-2)
      }
      cell.appendChild(document.createTextNode(cellElement))
      cell.id = currentYear+"-"+Number(currentMonth+1)+"-"+cellElement
      cell.style.width = "5em"
      cell.style.height = "3em"
      cell.style.verticalAlign = "text-top"
      cell.style.backgroundColor = "#ddd"
      cell.style.paddingLeft = "4px"
      cell.onclick = function() {
        selectedDate = this.textContent.slice(0,2)
        currentDate = this.textContent.slice(0,2)
        makeExpenseTitle(selectedDate)
        dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate)
        preObject.innerHTML = ''
        totalExpenseObject.innerHTML = '出費がありません😆'
        let totalExpense = 0
        dbRefObject.on('child_added', function (snap) {
          let selectedDateExpenses = snap.val()
          preObject.innerHTML +=  "<li>" +
          selectedDateExpenses.item + ": " +
          selectedDateExpenses.description + " "+
          selectedDateExpenses.expense + "円" +
          "(" + selectedDateExpenses.purpose + ")</li>"
          totalExpense += Number(selectedDateExpenses.expense)
          totalExpenseObject.innerHTML = "合計 " + totalExpense + "円"
        }
        )
      };
      if(i==0){
        cell.style.backgroundColor = "#bbb" // ヘッダ行
        cell.style.textAlign = "center"
        cell.style.verticalAlign = "middle"
        cell.style.paddingLeft = "0em"
      }else if(j%7==6){
        cell.style.color = "#4682B4"
      }else if(j%7==0){
        cell.style.color = "#FFA07A"
      }else{
      }
    }
  }
  document.getElementById(tableId).appendChild(calendarTable)
  for (i = 1; i < 32; i ++) {
    let dateNum = ("0" + i).slice(-2)
    let cellObject = document.getElementById(currentYear+"-"+Number(currentMonth+1)+"-"+dateNum)
    let totalExpense = 0
    let p = document.createElement('p')
    let node = document.createTextNode(totalExpense +"円")
    p.appendChild(node)
    cellObject.appendChild(p)
    dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+dateNum)
    dbRefObject.on('child_added', function (snap) {
      let cellExpenses = snap.val()
      totalExpense += Number(cellExpenses.expense)
      p.innerHTML = totalExpense +"円"
    })
  }
}

function makeYYYYMM(year, month, monthId) {
  var yyyydd = year + '年 ' + Number(month+1) + "月"
  document.getElementById(monthId).innerHTML = yyyydd
}

window.addEventListener("load", makeCalendar(currentYear, currentMonth))

function makeCalendar(year, month) {
let startDate = new Date(year, month, 1)
let endDate = new Date(year, Number(month+1), 0)
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
  let expense = document.getElementById("expense").value
  let purpose = document.getElementById("purpose").value
  let item = document.getElementById("item").value
  let description = document.getElementById("description").value
  writeExpenseData(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate, expense, purpose, item, description)
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
  totalExpenseObject.innerHTML =　''
}

function showNextMonth() {
  // delete calendar before make new one
  document.getElementById("table").textContent = null
  currentMonth++
  if (currentMonth > 11) {
    currentYear++
    currentMonth = 0
  }
  this.makeCalendar(currentYear, currentMonth)
  totalExpenseObject.innerHTML =　''
}