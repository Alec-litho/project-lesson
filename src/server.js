let express = require('express')
let fs = require('fs');

const cors = require("cors");
let app = express()
app.use(cors());

app.post('/', (req,res) => {
    req.on('data', (data) => {
        fs.writeFile('./data/posts.json', data.toString(), (err) => {
            console.log(err);
        })
    })
    res.sendFile('C:/Users/opall/OneDrive/Рабочий стол/programming/JavaScript/3 React/project lesson/src//data/posts.json')
})
app.post('/pictures', (req,res) => {
    req.on('data', (data) => {
        fs.writeFile('./data/myPictures/photoData.json', data.toString(), (err) => {
            console.log(err);
        })
    })
    res.sendFile('C:/Users/opall/OneDrive/Рабочий стол/programming/JavaScript/3 React/project lesson/src//data/myPictures/photoData.json')
})
app.post('/albums', (req,res) => {
    fs.readFile('./data/myPictures/albums.json', 'utf8', (err, data) => {
        res.send(data.toString())
        req.on('data', (data) => {
            fs.writeFile('./data/myPictures/albums.json', data.toString(), (err) => {
                console.log(err);
            })
        })
    })

})
app.get('/albums', (req,res) => {
   fs.readFile('./data/myPictures/albums.json', (err, data) => {
      res.send(data.toString())
   })
})
app.get('/pictures', (req,res) => {
    res.sendFile('C:/Users/opall/OneDrive/Рабочий стол/programming/JavaScript/3 React/project lesson/src//data/myPictures/photoData.json')
    console.log('pictures are taken');
})
app.get('/', (req,res) => {
    res.sendFile('C:/Users/opall/OneDrive/Рабочий стол/programming/JavaScript/3 React/project lesson/src//data/posts.json')
})
app.listen(3001, (w) => {
    console.log('w');
})