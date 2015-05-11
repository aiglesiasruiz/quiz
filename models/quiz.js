// Definicion del modelo de quiz con validacion

module.exports = function(sequelize, DataTypes){
   return sequelize.define('Quiz',
   		{ pregunta: {
   			type: DataTypes.STRING,
   			validate: {notEmpty: {msg: "-> Falta Pregunta"}}
   		  },
   		  respuesta: {
   		  	type: DataTypes.STRING,
   		  	validate: {notEmpty: {msg: "-> Falta Respuesta"}}
   		  }
   		}
   	);
}


