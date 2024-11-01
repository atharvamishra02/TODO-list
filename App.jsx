import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos")) 
      setTodos(todos)
    }
  }, [])
  
  const saveToLS = (params) =>{
    localStorage.setItem("todos",JSON.stringify(todos))
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
    
  }
  const handleEdit = (e, id) => {
    let t = todos.filter(i=>i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item =>{
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }
  
  const handleDelete = (e, id) => {
  
    let newTodos = todos.filter(item =>{
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }
  const handlecheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item=>{
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS()
  }
  const handleAdd = () => {
    setTodos([...todos, {id :uuidv4(), todo, isCompleted: false}])
    setTodo("")
    saveToLS()

  }


  

  return (
    <>
      <Navbar/>
        <div className='container mx-auto my-5 rounded-xl p-5 bg-slate-400 min-h-[70vh] w-1/2'>
        <h1 className='font-bold text-center text-lg'>iTask - Manage your tasks at one place</h1>
          <div className='AddTODO flex flex-col gap-4'>
            <h1 className='text-xl font-bold'>Add a Todo</h1>
            <input onChange = {handleChange} value = {todo} className = 'rounded-md w-auto h-[5vh]' type="text" />
            <button onClick={handleAdd} disabled = {todo.length<3} className='font-bold text-xl rounded-xl py-2 px-6 w- bg-slate-700 hover:bg-slate-500 disabled:bg-slate-900 text-white'>Save</button>
          </div>
            <h2 className='text-xl font-bold py-5'>YOUR TODOS</h2>
            <div className='bg-black h-1'></div>
            <div className='todos'>
              {todos.length === 0 && <div className='m-5'>No Todos To Display</div>}
              {todos.map(item =>{

                return<div key = {item.id} className ='todo flex gap-5 py-3'>
                  <div className='flex gap-5'>
                <input name = {item.id} onChange = {handlecheckbox} type="checkbox" value = {item.isCompleted} id= "" />
                <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
                  </div>
                <div className='buttons flex'>
                  <button onClick={(e) =>handleEdit(e, item.id)} className='font-bold text-xl rounded-md px-3 bg-slate-700 mx-2 hover:bg-slate-500 text-white'><FaEdit /></button>
                  <button onClick ={(e) => {handleDelete(e, item.id)}}className='font-bold text-xl rounded-md px-3 bg-slate-700 mx-2 hover:bg-slate-500 text-white'><MdDelete /></button>
                </div>

              </div>
              })}
            </div>
        </div>


    </>
  )
}

export default App
