const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

const filePath = path.join(__dirname, 'database.json');

const readEventsFromFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([])); 
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

const writeEventsToFile = (events) => {
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
};

app.get('/api/events', (req, res) => {
  const events = readEventsFromFile();
  res.status(200).json(events);
});

app.post('/api/events', (req, res) => {
  const newEvent = req.body;
  const events = readEventsFromFile();
  newEvent.id = Date.now().toString();
  events.push(newEvent);
  writeEventsToFile(events);
  res.status(201).json(newEvent);
});

app.put('/api/events', (req, res) => {
  const updatedEvent = req.body;
  const events = readEventsFromFile();
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    writeEventsToFile(events);
    res.status(200).json(updatedEvent);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

app.delete('/api/events', (req, res) => {
  const { id } = req.query;
  const events = readEventsFromFile();
  const filteredEvents = events.filter(event => event.id !== id);
  writeEventsToFile(filteredEvents);
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
