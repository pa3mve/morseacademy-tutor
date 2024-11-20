require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const mongoose = require('mongoose');
const server = app.listen(port,()=>{console.log('running')})

mongoose.connect(process.env.DBCONNECTIONURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000

app.get("/",(req,res)=>{
    res.send('hello world')
})