import {useState, useEffect} from 'react'
import Notes from './components/Note'
import axios from 'axios'


const App = () => {
    const [notes, setNotes] = useState([]) 

    const hook = () => {
        axios 
            .get('http://localhost:3001/persons')
            .then(response => 
                setNotes(response.data)    
            )
    }

    useEffect(hook, [])
    console.log(notes)
    return (
        <div>
            <h1>Hello World</h1>
            <ul>
                {notes.map(n => <Notes key={n.id} note={n}/>)}
            </ul>
        </div>
    )
}

export default App; 