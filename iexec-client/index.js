
//imports
const express = require('express');
const path = require('path')

//init server
const app = express()
const port = 3000

//serve static files
app.use(express.static(path.join(__dirname ,'build')));

app.get('/', async (req,res)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

app.use('/api', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})