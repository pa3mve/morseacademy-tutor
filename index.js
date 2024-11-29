require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const mongoose = require('mongoose');
const { Schema } = mongoose;
const server = app.listen(port,()=>{console.log('running')})
const cors = require('cors');

mongoose.connect(process.env.DBCONNECTIONURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000

const messageSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    uid: { type: String, required: true }
  });   

  const Message = mongoose.model('Message', messageSchema);

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.get('/api/messages', async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve messages", details: err });
    }
  });
  
  // POST /messages - Create a new message
  app.post('/api/messages', async (req, res) => {
    const { name, type, message, uid } = req.body;
  
    if (!name || !type || !message || !uid) {
      return res.status(400).json({ error: "All fields (name, type, message, uid) are required" });
    }
  
    try {
      const newMessage = new Message({ name, type, message, uid });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: "Failed to create message", details: err });
    }
  });
  
  // DELETE /messages/:uid - Delete a message by UID
  app.delete('/api/messages/:uid', async (req, res) => {
    const { uid } = req.params;
  
    try {
      const deletedMessage = await Message.findOneAndDelete({ uid });
      if (!deletedMessage) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.status(200).json({ message: "Message deleted", data: deletedMessage });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete message", details: err });
    }
  });
