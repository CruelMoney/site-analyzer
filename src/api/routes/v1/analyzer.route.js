const express = require('express');
const { analyze } = require('../../services/lighthouse');
const { handler: errorHandler } = require('../../middlewares/error');

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  try {
    return await analyze(url).then(data => res.json(data));
  } catch (error) {
    return errorHandler(error, req, res);
  }
});

module.exports = router;
