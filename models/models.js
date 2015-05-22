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


// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);


//Importar definicion de tabla users
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);



//los comentarios pertenecen a un quiz
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


// los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);


//los favoritos pertenecen a usuario registrado
Favourites = sequelize.define('Favourites');
User.belongsToMany(Quiz, {through: 'Favourites'});
Quiz.belongsToMany(User, {through: 'Favourites'});


exports.Quiz = Quiz;//exportar definicion de tabla Quiz
exports.Comment = Comment;//Eportar def de tabla comment
exports.User = User;// exportar def de tabla user
exports.Favourites = Favourites; //exportar tabla favoritos


//sequelize.sync() crea e inicializa tabla de preguntasen DB 
sequelize.sync().then(function() {
  //then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate( 
        [ {username: 'admin',   password: '1234', isAdmin: true},
          {username: 'pepe',   password: '5678'}] // el valor por defecto de isAdmin es 'false'
      ).then(function(){
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.bulkCreate( 
              [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', UserId: 2}, // estos quizes pertenecen al usuario pepe (2)
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2}
              ]
            ).then(function(){
              console.log('Base de datos (tabla quiz) inicializada')});
          };
        });
      });
    };
  });
});

