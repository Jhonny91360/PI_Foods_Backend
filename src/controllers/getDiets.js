const {Diet} = require("../db")
const URL="https://api.spoonacular.com/recipes/"
const axios = require("axios")
require('dotenv').config();
const {API_KEY} = process.env;
const maxRecipes=100; //Numero de recetas a traer

const getDiets=async()=>{
    
        const dietsBDD = await Diet.findAll();
 
        if (dietsBDD.length > 0) {  //Si ya estan las dietas en la base de datos       
          return dietsBDD;          //Retorno las dietas

        }else {                     //Si la tabla Diet esta vacia

          //Hago el llamado a la API para obtener 100 Recipes con toda la info
          const dietsFromApi= await axios.get(`${URL}complexSearch?apiKey=${API_KEY}&number=${maxRecipes}&addRecipeInformation=true`)
          //esto retorna dentro de data.results, un array de recetas, dentro de cada receta estara "diets" con un array de dietas
          
          const dietasSinRepetir = new Set(); //creo un Set donde guardare las dietas, el set me asegura no repetir valores

        for (const receta of dietsFromApi.data.results) { // Recorro todas la recetas

            for (const dieta of receta.diets) {           //Dentro de cada receta recorro su array de dietas
                dietasSinRepetir.add(dieta);              //Agrego cada dieta al set 
                }
        }
         
          const arrayDietas=[...dietasSinRepetir]       // Convierto los valores del set a un array
          
          //Agregar dietas a la base de datos
          for (const dieta of arrayDietas) {            // Recorro todas las dietas obtenidas
            await Diet.findOrCreate({                   //Por cada dieta, creo un registro en la BDD
              where: {name: dieta}                      //Verifico que la dieta no exista, aunque es redundante por el set
            });
          }
        /////////////////////////

        //Leer desde la base de datos///
        const dietsBDD = await Diet.findAll();         //Leo la BDD y retorno, aunque podria retornar el arrayDietas
        ///////////////////////
          return dietsBDD
        }
      
}

module.exports=getDiets








