const searchByName = require ("../controllers/searchByName")
const {Recipe,Diet} = require("../db")

const createdRecipe=async(body)=>{

    let {title,image,summary,healthScore,analyzedInstructions,diets}=body  //Destructuring de datos
    
    console.log("mi title: ", title)
    if(!title || !analyzedInstructions || !diets) throw Error ("Faltan datos") //Valido datos necesarios
    if(!Array.isArray(diets)) throw Error("Tipo de dato en dietas invalido") //Debe ser arrays de id's
    healthScore=parseInt(healthScore); // Paso string a numero


    //Reutilizo mi controller de searchByName
    let recipes= await searchByName(); //No paso name para que me traiga todas las recipes(API+BDD) 
    recipes= recipes.filter(recipe=> recipe.title===title) //Filtro por title para encontrar coincidencia
    console.log("mi filtro: ",recipes)
    if(recipes.length) throw Error ( `The recipe  ${title} already exists`) //Si hay una receta con el nombre, arrojo error

    
    //Busco y creo Recipe en la base de datos y guardo la instancia
    const [recipe,created]= await Recipe.findOrCreate({
        where: { title: title },  //Verifico que no exista un registo con el mismo nombre "title", es redundante
        defaults: { title,image,summary,healthScore,analyzedInstructions }
    })

    if(!created) throw Error( `The recipe  ${title} already exists`) //Si created=false
  
    // Busco los tipo de dieta especificados
    //tipo dieta sera un array con id's de Dietas

    for (const idDieta of diets) {  //Recorre el array diets ejemplor --->  diets=[3,4,8]
            const diet= await Diet.findOne({ where: { id: idDieta } }); //Busco en tabla Diet segun ID
            if(!diet) throw Error ("Dieta no encontrada"); //Si no existe tal dieta
            await recipe.addDiet(diet); //Agrego relacion en tabla intermedia
            await recipe.save();        //Guardo
        }
    
    return `Receta  ${title} guardada`
}

module.exports=createdRecipe;