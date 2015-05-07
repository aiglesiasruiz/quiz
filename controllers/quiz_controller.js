var models = require('../models/models.js');


//GET /quizes
exports.index = function(req, res){
   models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes});  
   })
};

//GET /quizes?search
exports.search = function(req, res){
  var palabra = req.query.busqueda;
  
  models.Quiz.findAll({ where:['pregunta like ?', '%'+palabra+'%'] }).then(function(quizes) {
    //console.log('Este es el log %s',quizes[0].pregunta);
    res.render('quizes/index', {quizes: quizes});
  });
        

 // models.Quiz.findAll({ where: ["id = ?", req.query.busqueda] }).then(function(quizes) {
 //   res.render('quizes/search', {quizes: quizes});
 // })
};


//GET /quizes/:id

exports.show = function(req, res){
   models.Quiz.find(req.params.quizId).then(function(quiz) {
      res.render('quizes/show', { quiz: quiz });
   })
};


//GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) { 
     if (req.query.respuesta === quiz.respuesta){
       res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
   } else {
       res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
   }
  })
};



