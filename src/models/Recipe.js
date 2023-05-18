const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Recipe', {
    //Atributos
    id:{
      type:DataTypes.UUID,            //Tipo de dato identificador único universal (UUID)     
      defaultValue:DataTypes.UUIDV4,  //Para que sequelize genere el identificadoUID versión 4 (generado de forma aleatoria)
      primaryKey:true                 //Llave primaria
    },
    
    title: {
      type: DataTypes.STRING,         //Tipo de dato texto
      allowNull: false,               //No se permite valor vacio
      unique:true
    },

    image:{
      type: DataTypes.STRING         //Tipo de dato texto
    },

    summary:{
      type: DataTypes.STRING,         //Tipo de dato texto
      allowNull: false
    },

    healthScore:{
      type: DataTypes.INTEGER,        //Tipo de dato numero entero
      allowNull: false
    },

    analyzedInstructions:{
      type: DataTypes.STRING,         //Tipo de dato texto
      allowNull: false,               //No se permite valor vacio
    }


  },{
    timestamps: false // Desactivar los campos createdAt y updatedAt
  });
};
