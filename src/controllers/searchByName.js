const URL="https://api.spoonacular.com/recipes/"
const axios = require("axios")
const { Op } = require('sequelize');
const {Recipe,Diet} = require("../db")
require('dotenv').config();
const {API_KEY} = process.env;
const maxRecipes=100;

//Ejemplo del endpoint
//https://api.spoonacular.com/recipes/complexSearch?&number=100&addRecipeInformation=true?api_key=4a25369acefb47f6832075a9a3f5f827 

//Esta funcion controladora si no recibe name, traera las recipes de la API y de la base de datos
//si recibe name entonces filtra las recipes recibidas de la API y las recipes de la BDD y retornar resultado


const searchByName=async(name)=>{

    let search=[]  //Array que almacenara la respuesta  

    //  traigo todos los recipes, limitando a 100 por performance
    const searchAPI= await axios.get(`${URL}complexSearch?&number=${maxRecipes}&apiKey=${API_KEY}&addRecipeInformation=true`)
    
    if(!name) {  //Si no envian name,  entonces respondo con el resultado de la API y de la BDD
        
        search=search.concat(searchAPI.data.results)  //Agrego resultados de la API a mi array de respuesta

        let searchBDD= await Recipe.findAll(       //Leo las recipes de la base de datos
        {include: [{
                model: Diet,                        //Traigo la relacion con Diet
                as:"diets",                         //tiene el alias "diets"
                attributes: ['name'],               //El campo nombre de cada diet
                through: { attributes: [] }         //Los otros atributos no son necesarios
              }],
            
        });   // ---> esto genera un array asi dentro de diets = [ {name='whole 30'},{name='primal'}]


        searchBDD = searchBDD.map(recipe => {       //Recorro todas las recetas

            const dietsNames = recipe.diets.map(dieta => dieta.name); //Recorro el array diets dentro de cada receta
            return {                    //Retorno la receta con el valor de diets modificado
              ...recipe.toJSON(),       //toJSON para manejar objeto plano de JS ignorando caraceteristicas del modelo sequelize
              diets: dietsNames
            };
        }); // ---> esto genera un array asi dentro de diets= ['whole 30','primal']
        

        search= search.concat(searchBDD) //Agrego resultados de la BDD a mi array de respuesta

        return search
    } 
    else{       //Si recibo un name
        let nameLowerCase= name.toLowerCase()  //Paso todo a minusculas      //Busco que el name recibido este en el tilte de las recipes
        const searchApiFilter=searchAPI.data.results.filter( (recipe)=> recipe.title.toLowerCase().includes(nameLowerCase))
        
        search=search.concat(searchApiFilter) //Agrego recipes filtrados a mi array de respuesta

        let searchBDD= await Recipe.findAll( //Busco recipes en la base de datos que contengan el name
            {where:
                {title:{
                    [Op.iLike]: `%${nameLowerCase}%`  //Ilike no es case sensitive
                     }
                },include: [{
                    model: Diet,                      //Traigo la relacion con Diet
                    as:"diets",                       //tiene el alias "diets"
                    attributes: ['name'],             //El campo nombre de cada diet
                    through: { attributes: [] }       //Los otros atributos no son necesarios
                  }],
                
            }); // ---> esto genera un array asi dentro de diets = [ {name='whole 30'},{name='primal'}]

        searchBDD = searchBDD.map(recipe => {         //Recorro todas las recetas
            const dietsNames = recipe.diets.map(dieta => dieta.name); //Recorro el array diets dentro de cada receta
            return {                                   //Retorno la receta con el valor de diets modificado
              ...recipe.toJSON(),                      //toJSON para manejar objeto plano de JS ignorando caraceteristicas del modelo sequelize
              diets: dietsNames
            };
        });

        search=search.concat(searchBDD) //Agrego busqueda filtrada a mi array de resultados

        if(search.length<1) throw Error ("No recipes found with that name") //Si no se encontro ninguna Receta
        return search;
    }
    
}
module.exports=searchByName;