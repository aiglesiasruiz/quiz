var models = require('../models/models.js');

var numMedio=0;
var siComen=0;
var noComen=0;

exports.load = function(req, res) {
	models.Quiz.findAll().then(function(quizes){	
    	models.Comment.findAll().then(function(comentarios){
  			numMedio=(comentarios.length/quizes.length);
  			siComen=0;
			noComen=0;
  			for(var i=0; i< quizes.length; i++){
//    		a+=quizes[i].comment.length;
//    		console.log(quizes[i].Comment.publicado+"COMENTARIOOOOOOOS");
    		console.log("DADADADAD"+ comentarios[i].publicado);
    			if(comentarios[i].publicado){
    				siComen=siComen+1;
    			}else{
    				noComen=noComen+1;
    			}
    		} 
  			res.render('quizes/statistics', {quizes: quizes, media: numMedio, comentarios: comentarios , noComen: noComen, siComen: siComen, errors: []}); 
    	}).catch (function (error) { next(error)});



    }).catch (function (error) { next(error)});

   

    
    
  	
};

  

