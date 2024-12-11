const express = require('express');
const fs = require("fs");
const {pipeline, PassThrough} = require("node:stream");
const router = express.Router({mergeParams: true});

/**
 * @openapi
 * /{version}/sprites/{type}/{id}:
 *   get:
 *     tags:
 *       - Sprite
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus version need to query
 *         default: 3.0.12.7
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - achievement
 *             - achievementcategory
 *             - items
 *             - monsters
 *             - spells
 *         required: true
 *         description: The database to query
 *         default: items
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The queried id
 *         default: 1
 *     description: Get sprite for icon in database
 *     responses:
 *       200:
 *         description: Return a sprite
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:type/:id', function(req, res) {
    const version = req.params.version;
    const type = req.params.type;
    const id = req.params.id;

    const r = fs.createReadStream('./data/scraped/' + version + '/sprites/' + type + '/' + id + '.png') // or any other way to get a readable stream
    const ps = new PassThrough() // <---- this makes a trick with stream error handling
    pipeline(
        r,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            if (err) {
                console.log(err) // No such file or any other kind of error
                return res.sendStatus(400);
            }
        })
    res.set("Content-Type", "image/png");
    ps.pipe(res) // <---- this makes a trick with stream error handling
});

module.exports = router;
