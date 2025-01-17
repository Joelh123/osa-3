require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")

const currentDate = new Date()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(express.static("dist"))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())

app.get("/", (request, response) => {
    response.send("<h1>hello world</h1>")
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${Person.find({}).then(persons => persons.length)} people</p><p>${currentDate}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: "content missing" })
    }

    console.log(body.name)
    console.log(body.number)

    const personObject = new Person({
        name: body.name,
        number: body.number
    })

    personObject.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})