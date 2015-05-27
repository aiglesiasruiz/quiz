var models = require('../models/models.js');


// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
    var objQuizOwner = req.quiz.UserId;
    var logUser = req.session.user.id;
    var isAdmin = req.session.user.isAdmin;

    if (isAdmin || objQuizOwner === logUser) {
        next();
    } else {
        res.redirect('/');
    }
};


//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
    where: {
      id: Number(quizId)
    },
    include: [{
      model: models.Comment
    }]
  }).then(function(quiz) {
    if(quiz){
      req.quiz = quiz;
      next();
    }else {next(new Error('No existe quizId = '+quizId))}
  }).catch(function (error) {next(error)});
};


//POST /quizes/create
exports.create = function(req, res){
  req.body.quiz.UserId = req.session.user.id;
  if(req.files.image){
    req.body.quiz.image = req.files.image.name;
  }

  var quiz = models.Quiz.build( req.body.quiz );
  
  quiz.validate().then(function(err){
    if(err){
      res.render('quizes/new',{quiz: quiz, errors: err.errors});
    }else{
      quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]}).then(function(){res.redirect('/quizes')})
    }
  });
};


//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta:"Respuesta"});
  res.render('quizes/new', {quiz: quiz, errors: []});
};



//GET /quizes
exports.index = function(req, res){
  var options = {};
  if(req.user){
    options.where = {UserId: req.user.id}
  }
  if(req.session.user){
    var lista = [];
    if(req.query.busqueda===undefined){
      models.Favourites.findAll({where:{UserId: Number(req.session.user.id)}}).then(function(favs){
      var quizid;
      console.log("Tamaño favs "+favs.length);
      console.log("Tamaño de lista es (deberia ser 0) "+lista.length);

      if(favs.length === 0){
        models.Quiz.findAll(options).then(
            function(quizes) {
              res.render('quizes/index.ejs', {quizes: quizes, favs: lista, errors: []});
          }).catch (function (error) { next(error)});
        return;
      }else{

      for (var i=0; i<favs.length; i++){
        console.log(" ENTRO EN EL FOOR");
        quizid=favs[i].QuizId;
        console.log("FUNCIONA LA ASIGNACION "+quizid);
        models.Quiz.findAll({ where: { id: [quizid] } }).then(function(quiz){
          console.log("LA PREGUNTAAA ES  "+ quiz[0].pregunta);
          lista.push(quiz[0]);
          console.log("La longitud de lista es "+lista.length);
          if(lista.length === favs.length){
           models.Quiz.findAll(options).then(
            function(quizes) {
              res.render('quizes/index.ejs', {quizes: quizes, favs: lista, errors: []});
          }).catch (function (error) { next(error)});
        }
        });
      }}
    }).catch (function (error) { next(error)});
   



    }else{
      var palabra =req.query.busqueda;
      models.Favourites.findAll({where:{UserId: Number(req.session.user.id)}}).then(function(favs){
      var quizid;
      console.log("Tamaño favs "+favs.length);
      console.log("Tamaño de lista es (deberia ser 0) "+lista.length);
    
      if(favs.length === 0){
         models.Quiz.findAll({ where: ["pregunta like ?", '%'+palabra+'%'] }).then(function(quizes) {
                res.render('quizes/index.ejs', {favs: lista, quizes: quizes, errors: []});
          }).catch (function (error) { next(error)});
        return;
      }else{


      for (var i=0; i<favs.length; i++){
        console.log(" ENTRO EN EL FOOR");
        quizid=favs[i].QuizId;
        console.log("FUNCIONA LA ASIGNACION "+quizid);
        models.Quiz.findAll({ where: { id: [quizid] } }).then(function(quiz){
          console.log("LA PREGUNTAAA ES  "+ quiz[0].pregunta);
          lista.push(quiz[0]);
          console.log("La longitud de lista es "+lista.length);
          if(lista.length === favs.length){
          models.Quiz.findAll({ where: ["pregunta like ?", '%'+palabra+'%'] }).then(function(quizes) {
                res.render('quizes/index.ejs', {favs: lista, quizes: quizes, errors: []});
          }).catch (function (error) { next(error)});
        }
        });
      }}
    }).catch (function (error) { next(error)});
    }
  }else {
    if(req.query.busqueda===undefined){
      models.Quiz.findAll(options).then(
        function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes, favs: lista, errors: []});
      }).catch (function (error) { next(error)});
    }else {
      var palabra =req.query.busqueda;
      models.Quiz.findAll({ where: ["pregunta like ?", '%'+palabra+'%'] }).then(function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes, favs: lista, errors: []});
      }).catch (function (error) { next(error)});
    }
  }
};



//GET /quizes/:id
exports.show = function(req, res){
   

  if(req.session.user){
  var lista = [];
  models.Favourites.findAll({where:{UserId: Number(req.session.user.id)}}).then(function(favs){
    var quizid;
    //console.log("Tamaño favs "+favs.length);
    //console.log("Tamaño de lista es (deberia ser 0) "+lista.length);
    
    if(favs.length === 0){
      models.Quiz.find(req.params.quizId).then(function(quiz) {
            res.render('quizes/show', { favs: lista, quiz: req.quiz, errors: [] });
      })
      return;
    }

    for (var i=0; i<favs.length; i++){
        //console.log(" ENTRO EN EL FOOR");
        quizid=favs[i].QuizId;
        //console.log("FUNCIONA LA ASIGNACION "+quizid);
        models.Quiz.findAll({ where: { id: [quizid] } }).then(function(quiz){
          //console.log("LA PREGUNTAAA ES  "+ quiz[0].pregunta);
          lista.push(quiz[0]);
          //console.log("La longitud de lista es "+lista.length);
          if(lista.length === favs.length){
          models.Quiz.find(req.params.quizId).then(function(quiz) {
            res.render('quizes/show', { favs: lista, quiz: req.quiz, errors: [] });
          })
        }
        });
    }
  }).catch (function (error) { next(error)});
  
  }else{
   models.Quiz.find(req.params.quizId).then(function(quiz) {
      res.render('quizes/show', { quiz: req.quiz, errors: [] });
   })
  }
};


//GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) { 
     if (req.query.respuesta === req.quiz.respuesta){
       res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
   } else {
       res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
   }
  })
};


//GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;
  res.render('quizes/edit',{quiz: quiz, errors: []});
};


//PUT /quizes/:id
exports.update = function(req, res){
  if(req.files.image){
    req.quiz.image = req.files.image.name;
  }
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  
  req.quiz.validate().then(function(err){
    if(err){
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
    }else {
      req.quiz.save({fields: ["pregunta", "respuesta", "image"]}).then(function()
        {res.redirect('/quizes');});
    }
  });
};


// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};



