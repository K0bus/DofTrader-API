const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});

const pricesSchema = new mongoose.Schema({
    timestamp: Date,
    server: String,
    itemID: Number,
    price: Number,
    authorID: Number,
});
const Prices = mongoose.model('Prices', pricesSchema);

/**
 * @openapi
 * /data/price/insert:
 *   post:
 *     tags:
 *       - Price Data
 *     requestBody:
 *       description: A JSON object containing all query param
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               server:
 *                 type: string
 *                 description: The server string
 *                 example: dakal_1
 *               itemID:
 *                 type: integer
 *                 description: Item Ankama ID
 *                 example: -1
 *               price:
 *                 type: integer
 *                 description: Item price to store
 *                 example: 1
 *               authorID:
 *                 type: integer
 *                 description: Author Identifier
 *                 example: -1
 *     description: Insert price to dabase
 *     responses:
 *       200:
 *         description: Return stored item
 */
router.post('/price/insert', function(req, res) {
    const server = req.body.server;
    const itemID = req.body.itemID;
    const price = req.body.price;
    const authorID = req.body.authorID;

    mongoose.connect('mongodb+srv://test:test@data.hviuj.mongodb.net/?retryWrites=true&w=majority&appName=Data').then(() => {
        const newPrice = new Prices(
            {
                timestamp: new Date(),
                server: server,
                itemID: itemID,
                price: price,
                authorID: authorID,
            }
        );
        newPrice.save().then(r => {
            res.end(JSON.stringify(r));
        });
    });
});

/**
 * @openapi
 * /data/price/get:
 *   post:
 *     tags:
 *       - Price Data
 *     requestBody:
 *       description: A JSON object containing all query param
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               server:
 *                 type: string
 *                 description: The server string
 *                 example: dakal_1
 *               itemID:
 *                 type: integer
 *                 description: Item Ankama ID
 *                 example: -1
 *     description: Get last price from the database
 *     responses:
 *       200:
 *         description: Return last price data
 */
router.post('/price/get', function(req, res) {
    const server = req.body.server;
    const itemID = req.body.itemID;
    res.setHeader('Content-Type', 'application/json');
    mongoose.connect('mongodb+srv://test:test@data.hviuj.mongodb.net/?retryWrites=true&w=majority&appName=Data').then(() => {
        Prices.find({})
            .where('server').equals(server)
            .where('itemID').equals(itemID)
            .sort({ _id: -1 }).limit(1).then((r) => {
            res.end(JSON.stringify(r));
        });
    });
});

module.exports = router;
