import { useEffect, useState } from 'react'
import personService from "./service/persons"

const Filter = ({ filterWith, setFilterWith }) => (
  <div>filter shown with <input value={filterWith} onChange={(event) => setFilterWith(event.target.value)} /></div>
)

const Personform = ({ addInfo, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addInfo}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => (
    personsToShow.map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></p>)
  )

const Notification = ({ message }) => {
  const notificationStyle = {
    color: "green",
    fontSize: 16,
    background: "lightgrey",
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  } else {
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }
}

const Error = ({ message }) => {
  const errorStyle = {
    color: "red",
    fontSize: 16,
    background: "lightgrey",
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  } else {
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [filterWith, setFilterWith] = useState("")
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = filterWith.length < 1
  ? persons
  : persons.filter(person => person.name.match(new RegExp(filterWith, "i")))

  const addInfo = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson === undefined) {
      personService
        .create(personObject)
        .then(response => setPersons(persons.concat(response)))

      setNotification(`Added ${newName}`)

      setTimeout(() => {
        setNotification(null)
      }, 4000)

    } else if (window.confirm(`${foundPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      personService
        .update(foundPerson.id, personObject)
        .then(response => setPersons(persons.map(person => person.id === response.id ? response : person)))
        .catch(error => {
          setError(`Information of ${foundPerson.name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== foundPerson.id))
        })

      if (error !== null) {
        setNotification(`Replaced ${newName}'s number`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      }

      setTimeout(() => {
        setError(null)
      }, 4000)
    }
  }

  const handleNameChange = (event) => (setNewName(event.target.value))

  const handleNumberChange = (event) => (setNewNumber(event.target.value))

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(response => setPersons(persons.filter(person => person.id !== response.id)))

      setNotification(`Deleted ${person.name}`)

      setTimeout(() => {
        setNotification(null)
      }, 2500)
    } else return
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={error} />
      <Notification message={notification} />
      <Filter filterwith={filterWith} setFilterWith={setFilterWith} />
      <h2>add a new</h2>
      <Personform addInfo={addInfo} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App