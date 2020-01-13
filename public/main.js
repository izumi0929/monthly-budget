const date = new Date()
let currentDate = date.getDate()
let currentYear = date.getFullYear()
let currentMonth = date.getMonth()
let currentYMD = currentYear+"-"+Number(currentMonth+1)+"-"+currentDate

function makeTable (data, tableId) {
  let rows = []
  let calendarTable = document.createElement("table")
  for (i=0; i < data.length; i++){
    rows.push(calendarTable.insertRow(-1))
    for (j=0; j < data[0].length; j++){
      cell=rows[i].insertCell(-1)
      cell.appendChild(document.createTextNode(data[i][j]))
      cell.id = currentYear+"-"+Number(currentMonth+1)+"-"+data[i][j]

      cell.style.width = "5em"
      cell.style.height = "3em"
      cell.style.verticalAlign = "text-top"
      cell.style.backgroundColor = "#ddd"
      cell.style.paddingLeft = "4px"
      cell.onclick = function() {
        selectedDate = this.textContent
        currentDate = this.textContent
        makeExpenseTitle(selectedDate)
        dbRefObject = firebase.database().ref().child('expenses').child(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate)
        preObject.innerHTML = ''
        totalExpenseObject.innerHTML = '出費がありません😆'
        let totalExpense = 0
        dbRefObject.on('child_added', function (snap) {
          let selectedDateExpenses = snap.val()
          preObject.innerHTML +=  "<li>" +selectedDateExpenses.expense + "円</li>"
          totalExpense += Number(selectedDateExpenses.expense)
          totalExpenseObject.innerHTML = "合計 " + totalExpense + "円"
        }
        )
        console.log()
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
  writeExpenseData(currentYear+"-"+Number(currentMonth+1)+"-"+currentDate, expense, purpose, item)
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