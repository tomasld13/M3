// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
let id = 0;
// TODO: your code to handle requests

/*{
    author: "Autor del Post"
    title: "Titulo del Post",
    contents: "Contenido del Post"
}*/
server.post('/posts', (req, res) => {
    if(!req.body.author || !req.body.title || !req.body.contents){
        res.status(STATUS_USER_ERROR).send({error: "No se recibieron los parámetros necesarios para crear el Post"})
    }else{
        id++;
        const obj = {
            author: req.body.author,
            title: req.body.title,
            contents: req.body.contents,
            id: id
        }
        posts.push(obj)
        res.send(obj)
    }
});

server.post("/posts/author/:author", (req, res) => {
    if(!req.params.author || !req.body.title || !req.body.contents){
        res.status(STATUS_USER_ERROR).send({error: "No se recibieron los parámetros necesarios para crear el Post"})
    }else{
        id++
        const obj = {
            author: req.params.author,
            title: req.body.title,
            contents: req.body.contents,
            id: id
        }
        posts.push(obj)
        res.send(obj)
    }
})

server.get("/posts", (req, res) => {
    if(req.query.term){
        const termInPost = posts.filter((post) => post.title.includes(req.query.term) || post.contents.includes(req.query.term))
        res.send(termInPost)
    }else{
        res.send(posts)
    }
})

server.get("/posts/:author", (req, res) => {
    const postByAuthor = posts.filter((post) => post.author === req.params.author)
    if(postByAuthor.length > 0){
        res.send(postByAuthor)
    }else{
        res.status(STATUS_USER_ERROR).send({error: "No existe ningun post del autor indicado"})
    }
})

server.get("/posts/:author/:title", (req, res) => {
    const postByAuthor = posts.filter((post) => post.author === req.params.author && post.title === req.params.title)
    if(postByAuthor.length > 0){
        res.send(postByAuthor)
    }else{
        res.status(STATUS_USER_ERROR).send({error: "No existe ningun post con dicho titulo y autor indicado"})
    }
})

server.put("/posts", (req, res) => {
    if(!req.body.id|| !req.body.title || !req.body.contents){
        res.status(STATUS_USER_ERROR).send({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }else{
        const postById = posts.find((post) => post.id === req.body.id)
        if(!postById){
            res.status(STATUS_USER_ERROR).send({error: "Ningun id corresponde a un post"})
        }else{
            postById.title = req.body.title;
            postById.contents = req.body.contents;
            res.send(postById)
        }
    }
    
})

server.delete("/posts", (req, res) => {
    const postById = posts.find((post) => post.id === req.body.id)
    if(!postById){
        res.status(STATUS_USER_ERROR).send({error: "Mensaje de error"})
    }
    posts = posts.filter(post => post !== postById)
    res.send({ success: true })
})

server.delete("/author", (req, res) => {
    const postsByAuthor = posts.filter((post) => post.author === req.body.author)
    if(postsByAuthor.length === 0){
        res.status(STATUS_USER_ERROR).send({error: "No existe el autor indicado"})
    }
    posts = posts.filter(post => postsByAuthor.includes(post.postByAuthor))
    res.send(postsByAuthor)
})
module.exports = { posts, server };
