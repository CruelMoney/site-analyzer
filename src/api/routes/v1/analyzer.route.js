const express = require('express');
const { analyze } = require('../../services/lighthouse');

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  analyze(url)
    .then(data => res.json(data));
});

module.exports = router;
