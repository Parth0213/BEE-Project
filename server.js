import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// code by mridul

import  fs  from 'fs'

const readDatabase = (Database) => {
    if(!fs.existsSync(Database)){
        fs.writeFileSync(Database,JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(Database,'utf-8'))
}

const writeDatabase = (Database , Data)=>{
    fs.writeFileSync(Database,JSON.stringify(Data,null,2))
}
const QueryFile = './Query.json'


const GetQuery = function(req,res){
    console.log("Enterd")
    const database = readDatabase(QueryFile);
    for(let i = 0 ; i < database.length ; i++){
        if(database[i].Question==req.body.Question){
            database[i].AskedFreq += 1;
            writeDatabase(QueryFile,database);
            return res.status(200).json({
                answer : database[i].Answer
            })
        }
    }
}

const GetSamples = function(req,res){
    console.log("Enterd")
    const database = readDatabase(QueryFile);
    let arr = []
    for(let i = 0 ; i < database.length ;i++){
        if((database[i].Question.toLowerCase()).includes(req.params.que.toLowerCase())){
            arr.push(database[i]);
        }
    }
    arr.sort((a, b) => b.AskedFreq - a.AskedFreq);
    return res.status(200).json({
        examples : arr.splice(0,5)
    })
}


app.post("/query",GetQuery);
app.post("/example/:que",GetSamples);














// till here 

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on  port ${process.env.PORT}`);
});
