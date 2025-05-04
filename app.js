const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname + "/views"))); // isso q faz o html renderizar
app.use(express.urlencoded({extended: true}))

const key = process.env.GEMINI_KEY;

app.get("/", (req, res)=>{
    res.render("index");
})

app.get("/readme/:prompt", async (req, res)=>{
    data = await callGemini(req.params.prompt);


    outDir = path.join(__dirname + "/generated/");
    fs.writeFileSync((outDir + "/readme.md"), data);

    res.download((path.join(__dirname + "/generated/", "readme.md")), "readme.md", (err)=>{
        if (err) {
            console.log("ERRO: " + err);
        }
    });
    //res.json({readme: data});
})


//

async function callGemini(prompt){

    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers:{"Content-Type": "application/json"},
        body: `{"contents": [{"parts":[{"text": "${prompt}"}]}]}`
    })
    let data = await response.json();
    readme = data.candidates[0].content.parts[0].text;

    return readme;
}

//

app.listen(8080, ()=>{
    console.log("Rodando!");
})
