var models = require('../models/models.js');

var numMedio=0;
var siComen=0;
var noComen=0;
var contador=0;

exports.load = function(req, res) {
	models.Quiz.findAll().then(function(quizes){	
    models.Comment.findAll().then(function(comentarios){
  		numMedio=(comentarios.length/quizes.length);
  		siComen=0;
			noComen=0;
			//console.log("CONTADORCOM "+ comentarios.length);
    	//console.log("CONTADORPRE "+ quizes.length);
  		for(var i=0; i< quizes.length; i++){
  			for(var j=0; j< comentarios.length; j++){
    			/**console.log("ASOCIADO "+ comentarios[j].QuizId);
    			console.log("PREGUNTA "+ quizes[i].id);
    			console.log("PREGUNTAS CON "+ siComen);
    			console.log("PREGUNTA SIN "+ noComen);
    			console.log("CONTADOR "+ contador);**/
    			if(comentarios[j].QuizId == quizes[i].id){
    				siComen=siComen+1;
    				break;
    			}else{
    				contador++;
    			}
    		}
    		//console.log("CONTADOR ANTES IF "+ contador);
    		if (contador ===(comentarios.length)){
    			//console.log("METEte EN EL PUTO IF");
	    		noComen=noComen+1;
    		}
    		contador = 0;
    	}	 
  		res.render('quizes/statistics', {quizes: quizes, media: numMedio, comentarios: comentarios , noComen: noComen, siComen: siComen, errors: []}); 
    }).catch (function (error) { next(error)});

  }).catch (function (error) { next(error)});
};

  

