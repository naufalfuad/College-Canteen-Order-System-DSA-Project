const express = require('express');
const path = require('path');
const { Canteen } = require('./canteen');

const app = express();
const canteen = new Canteen();                 // one shared queue for every visitor
const OPS = ['order', 'serve', 'reset'];

app.use(express.json());
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/canteen.js', (req, res) => res.sendFile(path.join(__dirname, 'canteen.js')));

app.get('/api/canteen', (req, res) => res.json(canteen.state()));

app.post('/api/:op', (req, res) => {
  const { op } = req.params;
  if (!OPS.includes(op)) return res.status(404).json({ error: 'Unknown operation' });
  try {
    canteen[op](req.body || {});
    res.json(canteen.state());
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Canteen queue running on http://localhost:${PORT}`));
