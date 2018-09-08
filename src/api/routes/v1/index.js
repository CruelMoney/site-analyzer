const express = require('express');
// const userRoutes = require('./user.route');
// const authRoutes = require('./auth.route');
const analyzerRoutes = require('./analyzer.route');

var packageJson = require('../../../../package.json');

const router = express.Router();

/**
 * @api {post} v1/status Status
 * @apiDescription Check that the service is running
 * @apiVersion 1.0.0
 * @apiName Status
 * @apiGroup Status
 * @apiPermission public
 *
 * @apiSuccess {String} status indicates that the service is running
 *
 */
router.get('/status', (req, res) => res.send('OK Version: ' + packageJson.version));

router.use('/analyze', analyzerRoutes);

// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

module.exports = router;
