var path = require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');

//usar BBDD SQlite:
var sequelize = new Sequelize(null, null, null,
                      {dialect: "sqlite", 
                       storage: "quiz.sqlite"}
                    );

//importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;//exportar definicion de tabala Quiz

//sequelize.sync() crea e inicializa tabla de preguntasen DB 
sequelize.sync().then(function() {
  //success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count === 0) {
      Quiz.create( { pregunta: 'Capital de italia', respuesta: 'Roma'} )
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});

