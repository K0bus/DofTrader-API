const express = require('express');
const router = express.Router({mergeParams: true});
const utils = require("../utils");
const {readdir} = require("node:fs");

/**
 * @openapi
 * /api-infos/versions:
 *   post:
 *     tags:
 *       - API Information
 *     requestBody:
 *       description: A JSON object containing all query param
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               beta:
 *                 type: boolean
 *                 description: Add BETA version in the returned list
 *                 example: false
 *     description: Find all version in DofTrader API
 *     responses:
 *       200:
 *         description: Return list of available version in DofTrader API
 */
router.post('/versions', function(req, res) {
    let beta = req.body.beta
    if (beta === undefined) {
        beta = false
    }
    utils.getDirectories('./data/scraped/').then(versions => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(versions.filter(e => e !== "common" && (!e.includes('beta') || beta))));
    })
})

/**
 * @openapi
 * /api-infos/{version}/databases:
 *   get:
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus version need to query
 *         default: 3.0.12.7
 *     tags:
 *       - API Information
 *     description: Find all available database
 *     responses:
 *       200:
 *         description: Return list of available version in DofTrader API
 */
router.get('/:version/databases', function(req, res) {
    const version = req.params.version;
    readdir('./data/scraped/' + version + '/', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        const result = [];

        files.forEach(function (file) {
            if(!file.startsWith('i18n_') && file.endsWith('.json') && file !== 'spell_levels.json')
            {
                result.push(file.replace('.json', ''))
            }
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result))
    });
})

module.exports = router;
