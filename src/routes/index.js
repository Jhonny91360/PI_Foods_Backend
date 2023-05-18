const { Router } = require('express');
const getRecipeById = require("../controllers/getRecipeById")
const searchByName = require ("../controllers/searchByName")
const createdRecipe=require ("../controllers/createdRecipe")
const getDiets=require ("../controllers/getDiets")


const router = Router();

//Ruta para buscar recetas en Api y en base de datos
//si no envian nombre, se traen 100 recetas de la api
//la busqueda no es coincidencia exacta, independiente de mayusculas  y minusculas
router.get("/recipes",async (req,res)=>{
    
    try {
         //Puede llegar por query un nombre  name?=
        const {name}=req.query
        console.log("Name recibido por query: ",name)
        const search=await searchByName(name)
        return res.status(200).send(search)

    } catch (error) {
        return res.status(400).send(error.message)
    }
   
})


// Ruta para buscar detalle especifico de una receta
// Busca tanto en la API como en la BDD  a traves de un ID

router.get("/recipes/:idRecipe",async(req,res)=>{

    //Llegara el id por params
    try {
        const {idRecipe}=req.params
        console.log("Id recibido: ",idRecipe)
        const recipeId= await getRecipeById(idRecipe)
        return res.status(200).json(recipeId)
    } catch (error) {
        //console.log("mi error ",error.response.data.message); para detalle del id no encontrado
        console.log("Error en buscar por id: ",error.message)
        return res.status(400).send(error.message)
      
        
    }
    
})




//Ruta para crear una receta con los datos especificados por body(json)
//Debe tener al menos una relacion a una Dieta

router.post("/recipes",async(req,res)=>{
    
    try {
        console.log("Datos por body", req.body);
        const newRecipe= await createdRecipe(req.body);
        res.status(200).send(newRecipe);
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
   
})



// Ruta para inicialmente obtener Dietas de la api y 
//guardarlas en la base de datos
//Luego se consumen directo de la base de datos

router.get("/diets",async(req,res)=>{
    
    try {
        const diets= await getDiets();       
        return res.status(200).send(diets)
    } catch (error) {
        return res.status(400).send(error.message)
    }
    
})





module.exports = router;
