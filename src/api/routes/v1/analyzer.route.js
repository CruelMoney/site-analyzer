const express = require('express');
const { analyze } = require('../../services/lighthouse');
const { handler: errorHandler } = require('../../middlewares/error');
const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw new APIError({
        message: 'Provide a url in the post body',
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    return await analyze(url).then(data => res.json(data));
  } catch (error) {
    return errorHandler(error, req, res);
  }
});

module.exports = router;
