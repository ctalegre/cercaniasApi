import express from 'express';
import bodyParser from 'body-parser';
import api from './api'
import cors from 'cors'


// import router from './routes/index';
let app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// app.use('/');
app.get('/:o/:d', (req, res) => {
    api(req.params).then((resp) => {
       return res.json(resp);
   }).catch(err=> {
      return res.json(JSON.stringify(err));
   })
})
app.get('/', (req, res) => {
    api(req.query).then((resp) => {
       return res.json(resp);
   }).catch(err=> {
      return res.json(JSON.stringify(err));
   })
})
app.get('/health', (req, res) => {
    res.send(200);
})

app.listen(port, function () {
    console.log('Example app listening on port '+port+'!')
});