const express = require('express');
const fs = require("fs");
const router = express.Router({mergeParams: true});

/**
 * @openapi
 * /{version}/{lang}/search:
 *   post:
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus version need to query
 *         default: 3.0.12.7
 *       - in: path
 *         name: lang
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus lang to search
 *         default: fr
 *     requestBody:
 *       description: A JSON object containing all query param
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: Your search query
 *                 example: Piou
 *               page:
 *                 type: integer
 *                 description: The page to check if multiple page exist due to the limit
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: The limit of item sent in the responses
 *                 example: 5
 *     description: Search any text in the language file
 *     responses:
 *       200:
 *         description: Return nameId and text associated
 */
router.post('/', function(req, res) {
    const lang = req.params.lang;
    const version = req.params.version;
    const query = req.body.query;
    const page = req.body.page;
    const limit = req.body.limit;
    fs.readFile('./data/scraped/' + version + '/i18n_' + lang + '.json', 'utf8', function (err, data) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            console.log(err);
            res.end(JSON.stringify({}));
        } else {
            const json = JSON.parse(data);
            let result = [];
            for(let key in json) {
                if(json[key].toLowerCase().includes(query.toLowerCase())) {
                    result.push({
                        id: key,
                        name: json[key]
                    });
                    console.log(json[key]);
                }
            }
            res.end(JSON.stringify(result.slice((page-1)*limit, (page-1)*limit+limit)));
        }
    })
});
/**
 * @openapi
 * /{version}/{lang}/search/{type}:
 *   post:
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus version need to query
 *         default: 3.0.12.7
 *       - in: path
 *         name: lang
 *         schema:
 *           type: string
 *         required: true
 *         description: The Dofus lang to search
 *         default: fr
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - breeds
 *             - characteristics
 *             - effects
 *             - items
 *             - itemsets
 *             - itemtypes
 *             - recipes
 *             - spell_levels
 *             - spells
 *             - spells_new
 *             - states
 *             - summons
 *         required: true
 *         description: The database to query
 *         default: items
 *     requestBody:
 *       description: A JSON object containing all query param
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: Your search query
 *                 example: Piou
 *               page:
 *                 type: integer
 *                 description: The page to check if multiple page exist due to the limit
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: The limit of item sent in the responses
 *                 example: 5
 *     description: Search any text in the :type names
 *     responses:
 *       200:
 *         description: Return all items data queried
 */
router.post('/:type', function(req, res) {
    const lang = req.params.lang;
    const version = req.params.version;
    const typeQuery = req.params.type;
    const query = req.body.query;
    const page = req.body.page;
    const limit = req.body.limit;
    fs.readFile('./data/scraped/' + version + '/i18n_' + lang + '.json', 'utf8', function (langErr, langData) {
        fs.readFile('./data/scraped/' + version + '/' + typeQuery + '.json', 'utf8', function (itemErr, itemData) {
            res.setHeader('Content-Type', 'application/json');
            if (langErr) {
                console.log(langErr);
                res.end(JSON.stringify({}));
            } else if (itemErr) {
                console.log(itemErr);
                res.end(JSON.stringify({}));
            } else {
                const langJson = JSON.parse(langData);
                const itemJson = JSON.parse(itemData);
                let result = [];
                for (let key in itemJson) {
                    let itemNameId = itemJson[key]["nameId"];
                    if(itemNameId === undefined) itemNameId = parseInt(itemJson[key]["resultNameId"]);
                    if (langJson[itemNameId] !== undefined && langJson[itemNameId].toLowerCase().includes(query.toLowerCase())) {
                        let item = itemJson[key];
                        item["nameLang"] = langJson[itemNameId]
                        result.push(item);
                    }
                }
                res.end(JSON.stringify(result.slice((page - 1) * limit, (page - 1) * limit + limit)));
            }
        })
    })
});

module.exports = router;
