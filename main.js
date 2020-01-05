function makeTable (data, tableId) {
  var rows = []
  var table2 = document.createElement("table")
  for (i=0; i < data.length; i++){
    rows.push(table2.insertRow(-1))
    for (j=0; j < data[0].length; j++){
      cell=rows[i].insertCell(-1)
      cell.appendChild(document.createTextNode(data[i][j]))
      if(i==0){
        cell.style.backgroundColor = "#bbb"; // ヘッダ行
      }else{
        cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
      }
    }
  }
  document.getElementById(tableId).appendChild(table2)
}


function makeMonth(currentMonth, monthId) {
  var month = currentMonth + 1 + "月"
  document.getElementById(monthId).innerHTML = month
}



const date = new Date()
const currentYear = date.getFullYear()
let currentMonth = date.getMonth()

window.addEventListener("load", makeCalendar(currentMonth))

function makeCalendar(month) {
console.log(currentYear)
let startDate = new Date(currentYear, month, 1)
console.log(startDate)
let endDate = new Date(currentYear, month+1, 0)
const startDay = startDate.getDay()
const endDay = endDate.getDay()
var data = [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]]
var dates =[]
var weekIndex = 1
for (dateIndex = 1; dateIndex <= endDate.getDate(); dateIndex++ ){
  dates.push(dateIndex)
}
console.log("初めの曜日"+startDay)
console.log("終わりの曜日"+endDay)
for (i = 0; i < startDay; i++){
  dates.unshift('')
}
const firstWeek = dates.slice(0,7)
const secondWeek = dates.slice(7,14)
const thirdWeek = dates.slice(14,21)
const fourthWeek = dates.slice(21,28)
const fifthWeek = dates.slice(28,36)
console.log("endDay"+endDay)
for (i = 0; i < 6 - endDay; i++){
  fifthWeek.push('')
}
console.log(dates)


data.push(firstWeek)
data.push(secondWeek)
data.push(thirdWeek)
data.push(fourthWeek)
data.push(fifthWeek)
// 表の動的作成
makeTable(data,"table")
makeMonth(currentMonth, "month")
}

function showPreviousMonth() {
  document.getElementById("table").textContent = null
  currentMonth--
  this.makeCalendar(currentMonth)
}

function showNextMonth() {
  document.getElementById("table").textContent = null
  currentMonth++
  console.log(currentMonth)
  this.makeCalendar(currentMonth)
}