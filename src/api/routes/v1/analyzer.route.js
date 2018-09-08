const express = require('express');
const { analyze } = require('../../services/lighthouse');
const { handler: errorHandler } = require('../../middlewares/error');
const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const router = express.Router();

/**
 * @api {post} v1/analyze Analyze
 * @apiDescription Analyze a given URL using google lighthouse
 * @apiVersion 1.0.0
 * @apiName Analyze
 * @apiGroup Analyze
 * @apiPermission public
 *
 * @apiParam  {String}   url              The URL of the site to be analyzed.
 *                                        Must contain protocol. ex: "https://google.com"
 *
 * @apiSuccess {Object[]}  body               google lighthouse data.
 *
 * @apiError (Bad Request 400)    ValidationError  Some parameters may contain invalid or no values
 * @apiError (Internal 500)       ValidationError  Some parameters may contain invalid or no values
 */
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { url } = req.body;
    if (!url) {
      throw new APIError({
        message: 'Provide a url in the post body',
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    const result = await analyze(url).then(data => res.json(data));
    return result;
  } catch (error) {
    return errorHandler(error, req, res);
  }
});

module.exports = router;
