var path = require('path');

//Postgres DATABASE_URL
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name =   (url[6]||null);
var user =      (url[2]||null);
var pwd =       (url[3]||null);
var protocol =  (url[1]||null);
var dialect =   (url[1]||null);
var port =      (url[5]||null);
var host =      (url[4]||null);
var storage =   process.env.DATABASE_STORAGE;


//cargar modelo ORM
var Sequelize = require('sequelize');

//usar BBDD SQlite:
var sequelize = new Sequelize(DB_name, user, pwd,
         {dialect: protocol, 
          protocol: protocol,
          port:     port,
          host:     host,
          storage:  storage,
          omitNull: true
         }
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

