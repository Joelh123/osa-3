const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
}

const password = process.argv[2]

const url = `mongodb+srv://joelhheikkinen:${password}@cluster0.ryjqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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