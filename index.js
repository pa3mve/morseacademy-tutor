const express = require('express')
const app = express()
const port = process.env.PORT || 3001

const server = app.listen(port,()=>{console.log('running')})

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000

app.get("/",(req,res)=>{
    res.send('hello world')
})