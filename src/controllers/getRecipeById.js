const URL="https://api.spoonacular.com/recipes/"
const axios = require("axios")
require('dotenv').config();
const {API_KEY} = process.env;
const {Recipe,Diet} = require("../db")
const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getRecipeById=async(idRecipe)=>{

        let recipe={} //Variable donde almacenare el recipe encontrado
        
        //Si el id es de tipo uuid busco en mi BDD que tiene PK en formato uuid
        if(uuidRegExp.test(idRecipe)){
             recipe= await Recipe.findByPk(idRecipe,{//Busco en mi base de datos
               include:[
                 { 
                  model:Diet,       //Para leer relacion con Diet
                  as:"diets",       //tiene el alias "diets"
                  through: {
                    attributes: [] // para excluir otros atributos de la tabla intermedia
                  }
                  }
               ]
             }) 
             console.log("Receta encontrado por ID: ",recipe)

             if(recipe) { //Si encontre un recipe, mapeo las dietas relacionadas y retorno
                return {...recipe.toJSON(),
                    diets: recipe.diets.map(dieta => dieta.name) //Obtengo array con solo los nombres de las diets
                  }            
             } 
             throw Error (`No se encontro el id: ${idRecipe} en la BDD`)
        }

        else{                    //Si el id no es UUID, entonces busco en la api

              recipe= await axios.get(`${URL}${idRecipe}/information?includeNutrition=false&apiKey=${API_KEY}`)
             //Si la api recibe un id que no existe, causa un error el cual se captura en el
             //try cathc del handler que llama esta funcion
             //y el mensaje de error viene encapsulado asi: error.response.data.message
             return recipe.data //Si todo sale bien, retorno la data de la respuesta
        }
        
        
}

module.exports=getRecipeById;