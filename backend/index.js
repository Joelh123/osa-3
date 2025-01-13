const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
}

const url = process.env.MONGODB_URI;

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
    return
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
})

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
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
    })
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = Person.find({}).then(persons => persons.find(person => person.id === id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.find({}).then(persons => persons.filter(person => person.id !== id))

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