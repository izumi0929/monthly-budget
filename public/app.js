  
// Set the configuration for your app
// TODO: Replace with your project's config object


// set selected YMD


//set data
function writeExpenseData(date, expense, purpose, item, description) {
  firebase.database().ref('expenses/' + date).push(
    {
      'purpose': purpose,
      'expense': expense,
      'item': item,
      'description': description
    }
  )
}