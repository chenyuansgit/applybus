var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    //res.end("hello www.baoyamwang.com");
    res.render('index', {
        title: "申请人"
    });
});

module.exports = router;