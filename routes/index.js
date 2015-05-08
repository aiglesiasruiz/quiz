var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/**router.get('/quizes',function(req,res) {
    
    if(typeof req.query.busqueda != "undefined") {
        console.log("ENTRA EN IF");
        quizController.search;
    }
    quizController.index;  

});**/



router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/search', quizController.search);


router.get('/author', function(req, res) {
  res.render('author', { title: 'Autores' });
});

module.exports = router;
