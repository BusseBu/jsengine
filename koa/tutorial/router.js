
let Router = require('koa-router');

let reload = require('./controller/reload');
let task = require('./controller/task');
let article = require('./controller/article');
let zipview = require('./controller/zipview');

let router = module.exports = new Router();

router.get('/tutorial/reload', reload.get);
router.get('/task/:slug', task.get);
router.get('/tutorial/zipview/:name', zipview.get);

router.get('/:slug', article.get);
