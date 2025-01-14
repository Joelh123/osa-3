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
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const personObject = request.body

    if (!personObject.name || !personObject.number) {
        return response.status(404).json({ error: "name and number required" })
    }

    if (persons.find(person => person.name === personObject.name)) {
        return response.status(404).json({ error: "name must be unique" })
    }

    personObject.id = Math.floor(Math.random() * 1000000000)
    response.json(personObject)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})