const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Diet', {
    //Atributos
    id:{
      type:DataTypes.INTEGER,         //Numero entero
      autoIncrement:true,             //Auto incremento 
      primaryKey:true                 //Llave primaria
    },
    
    name: {
      type: DataTypes.STRING,         //Tipo de dato texto
      allowNull: false,               //No se permite valor vacio
    }

  },{
    timestamps: false // Desactivar los campos createdAt y updatedAt
  });
};
