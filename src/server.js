let express = require('express')
let fs = require('fs');

const cors = require("cors");
let app = express()
app.use(cors());

app.get('/', (req,res) => {
    res.sendFile('C:/Users/opall/OneDrive/Рабочий стол/programming/JavaScript/3 React/project lesson/src//data/posts.json')
})
app.listen(3001, (w) => {
    console.log('w');
})