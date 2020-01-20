const date = new Date()
var currentDate = date.getDate()
var currentYear = date.getFullYear()
var currentMonth = date.getMonth()
var currentYMD = currentYear+"-"+Number(currentMonth+1)+"-"+currentDate

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
      cell.style.backgroundColor = "rgba(205, 213, 223,1)"
      cell.style.paddingLeft = "1em"
      cell.style.paddingTop = "0.5em"
      cell.onclick = function() {
        selectedDate = this.textContent.slice(0,2)
        currentDate = this.textContent.slice(0,2)
        makeExpenseTitle(selectedDate)
        showExpenses()
      };
      if(i == 0){
        cell.style.backgroundColor = "rgb(204, 161, 180)" // ヘッダ行
        cell.style.textAlign = "center"
        cell.style.verticalAlign = "middle"
        cell.style.paddingLeft = "0em"
      }else if(j%7 == 0 || j%7 == 6){
        cell.style.color = "rgb(204, 161, 180)"
      }else{
      }
    }
  }
  document.getElementById(tableId).appendChild(calendarTable)
  for (i = 1; i < 32; i ++) {
    let dateNum = ("0" + i).slice(-2)
    let cellObject = document.getElementById(currentYear+"-"+Number(currentMonth+1)+"-"+dateNum)
    cellObject.onmouseover = function() {
      cellObject.style.backgroundColor = "rgba(204, 161, 180,0.3)"
      cellObject.style.boxShadow = "0 1px 1px 0 rgba(0,0,0,0.5)"
    }
    cellObject.onmouseleave = function() {
      cellObject.style.backgroundColor = "rgba(205, 213, 223,1)"
      cellObject.style.boxShadow = "0 0 0 0"
    }
    let totalExpense = 0
    let p = document.createElement('p')
    let node = document.createTextNode(totalExpense +"円")
    p.appendChild(node)
    p.className = "cellTotal"
    cellObject.appendChild(p)
    if (totalExpense == 0){
      p.innerHTML = "<p>0円</p>"
      p.style.fontWeight = "lighter"
      p.style.color = "rgba(0,0,0, 0.3)"
    }
    dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+dateNum)
    dbRefObject.on('child_added', function (snap) {
      let cellExpenses = snap.val()
      totalExpense += Number(cellExpenses.expense)
      p.innerHTML = totalExpense +"円"
      p.style.color = "black"
    })
  }
}

function showExpenses() {
  dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate)
  preObject.innerHTML = ''
  totalExpenseObject.innerHTML = '出費がありません😆'
  let totalExpense = 0
  dbRefObject.on('child_added', function (snap) {
    let selectedDateExpenses = snap.val()
    var uid = `${snap.key}`
    preObject.innerHTML +=  "<li>" +
    selectedDateExpenses.item + ": " +
    selectedDateExpenses.description + " "+
    selectedDateExpenses.expense + "円" +
    "(" + selectedDateExpenses.purpose + ")" +
    "<input type='submit' id='deleteExpense' onclick='deleteExpense(&quot;"+ uid + "&quot;)' value='削除'>" +
    "</li>"
    totalExpense += Number(selectedDateExpenses.expense)
    totalExpenseObject.innerHTML = "合計 " + totalExpense + "円"
  })
}

document.getElementById("deleteExpense").addEventListener('click', showExpenses(), false)

function makeTitle(year, month, monthId) {
  let yyyydd = year + '年 ' + Number(month+1) + "月"
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
makeTitle(year, month, "month")
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

function deleteExpense(uid){
  removeExpenseData(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate, uid)
  makeTable()
}

// TODO: 一つにする
function showPreviousMonth() {
  // delete calendar before make new one
  document.getElementById("table").textContent = null
  currentMonth--
  if (currentMonth < 0){
    currentMonth = 11
  }
  makeCalendar(currentYear, currentMonth)
  totalExpenseObject.innerHTML =　''
}

function showNextMonth() {
  // delete calendar before make new one
  document.getElementById("table").textContent = null
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
  }
  makeCalendar(currentYear, currentMonth)
  totalExpenseObject.innerHTML =　''
}