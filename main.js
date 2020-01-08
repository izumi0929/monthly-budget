function makeTable (data, tableId) {
  let rows = []
  let calendarTable = document.createElement("table")
  for (i=0; i < data.length; i++){
    rows.push(calendarTable.insertRow(-1))
    for (j=0; j < data[0].length; j++){
      cell=rows[i].insertCell(-1)
      cell.appendChild(document.createTextNode(data[i][j]))
      cell.onclick = console.log(data[i][j])
      if(i==0){
        cell.style.backgroundColor = "#bbb"; // ヘッダ行
      }else{
        cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
      }
    }
  }
  document.getElementById(tableId).appendChild(calendarTable)
}

function dateAlert(date) {
  alert("you clicked" + date)
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