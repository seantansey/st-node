var express = require('express');
var router = express.Router();
var pool = require('../pg.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows);
  })
});

module.exports = router;
