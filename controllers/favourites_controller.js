var models = require('../models/models.js');



// PUT /user/:userId(\\d+)/favourites/:quizId(\\d+)
exports.create = function(req, res) {
  var quiz = req.quiz;
  var user = req.user;
 
  console.log ("ENTRO EN CREATE");

  user.hasQuiz(quiz).then(function(result){
    if(result){
    	console.log("YA ESTA ASIGNADO COMO FAVORITOO");
	} else {
		user.addQuiz(quiz).then(function(){
			user.hasQuiz(quiz).then(function(result){
				console.log("el usuario "+user.id+
							"añade a favorita  "+quiz.id+" con exito");
				res.redirect(req.get('referer'));
			})
		})
	}
	
  	});

  
};


//DELETE 
exports.destroy = function(req, res){
	var quiz = req.quiz;
	var user = req.user;
	var id = user.id;
	
	user.hasQuiz(quiz).then(function(result){
		if(result){
			user.removeQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log("el "+user.id+" quito de favorita "+quiz.id+" con exito");
					//res.redirect(req.get('referer'));
				})
			})
		}//else{res.redirect('/');}
		else{console.log("No LA TENIA COMO FAVORITA");}
		

	});
	res.redirect(req.get('referer'));



};

//MOSTRAR
exports.show = function(req, res){
	
	var lista = [];
	models.Favourites.findAll({where:{UserId: Number(req.session.user.id)}}).then(function(favs){
		var quizid;
		console.log("Tamaño favs "+favs.length);
		console.log("Tamaño de lista es (deberia ser 0) "+lista.length);
		
		if(favs.length === 0){
			res.render('favourites.ejs', {favs: favs, errors: []});
			return;
		}

		for (var i=0; i<favs.length; i++){
		    console.log(" ENTRO EN EL FOOR");
		    quizid=favs[i].QuizId;
		    console.log("FUNCIONA LA ASIGNACION "+quizid);
		    models.Quiz.findAll({ where: { id: [quizid] } }).then(function(quiz){
		    	console.log("LA PREGUNTAAA ES  "+ quiz[0].pregunta);
		    	lista.push(quiz[0]);
		    	console.log("La longitud de lista es "+lista.length);
		    	if(lista.length === favs.length){
					models.Quiz.findAll().then(
      					function(quizes) {
      						res.render('favourites.ejs', {favs: lista, quizes: quizes, errors: []});
     				}).catch (function (error) { next(error)});
				}
		    });
		}
	}).catch (function (error) { next(error)});
};



