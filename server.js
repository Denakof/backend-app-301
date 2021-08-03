const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const axios =require('axios')


const server = express()
require('dotenv').config();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 4000


mongoose.connect('mongodb://denakof:denakof@cluster0-shard-00-00.vmc54.mongodb.net:27017,cluster0-shard-00-01.vmc54.mongodb.net:27017,cluster0-shard-00-02.vmc54.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-5hkrwh-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const colorSchema = mongoose.Schema({
    title:String,
    imageUrl:String

})

const userSchema = mongoose.Schema({
    email:String,
    color:[colorSchema]


})

let userModel = mongoose.model("color", userSchema)

seeding =()=>{
    let dena = new userModel({
        email:'denakofahi@gmail.com',
        color:{
            title:"Blue",
            imageurl:"https://htmlcolorcodes.com/assets/images/colors/navy-blue-color-solid-background-1920x1080.png"

        }
    })

    let razan = new userModel({
        email:'quraanrazan282@gmail.com',
        color:{
            title:"Pink",
            imageurl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEXmAIGQqiJ+AAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII="

        }
    })
    dena.save();
    razan.save();

}
// seeding();
server.get('/',(req,res)=>{
    res.send('Home route')
})

server.get('/colors', (req,res)=>{
axios.get('https://ltuc-asac-api.herokuapp.com/allColorData').then((results)=>{
    res.send(results.data)
})
})

server.get('/getcolors', (req,res)=>{
    userModel.findOne({email:req.query.email},(error,results)=>{
        if (error) {
            res.send(error)
        }else{
            res.send(results.data)
        }
    })
})

server.get('/favcolors', (req,res)=>{
    userModel.findOne({email:req.query.email},(error,results)=>{
        if (error) {
            res.send(error)
        }else{
            results.color.push(req.body)
            results.save();
            res.send(results.color)

        }
    })
})

server.delete('/removecolors/:index', (req,res)=>{
    let index = Number(req.params.index)
    userModel.findOne({email:req.query.email},(error,results)=>{
        if (error) {
            res.send(error)
        }else{
            results.color.splice(index,1)
            results.save();
            res.send(results.color)

        }
    })
})
server.put('/updatecolors/:index', (req,res)=>{
    let index = Number(req.params.index)
    userModel.findOne({email:req.query.email},(error,results)=>{
        if (error) {
            res.send(error)
        }else{
            results.color.splice(index,1,req.body)
            results.save();
            res.send(results.color)

        }
    })
})



server.listen(PORT, ()=>{
    console.log(`WORKING ON ${PORT}`);
})