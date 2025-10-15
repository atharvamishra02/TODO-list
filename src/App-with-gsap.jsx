import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { gsap } from "gsap";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const addSectionRef = useRef(null)
  const todosRef = useRef(null)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos")) 
      setTodos(todos)
    }

    // Initial page load animations
    if (containerRef.current && headerRef.current && addSectionRef.current && todosRef.current) {
      const tl = gsap.timeline()
      
      // Set initial states
      gsap.set([containerRef.current, headerRef.current, addSectionRef.current, todosRef.current], {
        opacity: 1
      })
      
      tl.from(containerRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .from(addSectionRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .from(todosRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
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
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`)
    
    gsap.to(todoElement, {
      x: 100,
      opacity: 0,
      scale: 0.8,
      rotation: 10,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        let newTodos = todos.filter(item =>{
          return item.id !== id
        });
        setTodos(newTodos)
        saveToLS()
      }
    })
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

    // Animate completion
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`)
    const todoText = todoElement.querySelector('.todo-text')
    
    if (newTodos[index].isCompleted) {
      gsap.to(todoElement, {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        duration: 0.3
      })
      gsap.to(todoText, {
        color: "#6b7280",
        duration: 0.3
      })
      gsap.fromTo(todoText, 
        { textDecoration: "none" },
        { textDecoration: "line-through", duration: 0.3 }
      )
    } else {
      gsap.to(todoElement, {
        backgroundColor: "transparent",
        duration: 0.3
      })
      gsap.to(todoText, {
        color: "#000000",
        duration: 0.3
      })
      gsap.to(todoText, {
        textDecoration: "none",
        duration: 0.3
      })
    }
  }
  const handleAdd = () => {
    const newTodo = {id :uuidv4(), todo, isCompleted: false}
    setTodos([...todos, newTodo])
    setTodo("")
    saveToLS()

    // Animate new todo item
    setTimeout(() => {
      const newTodoElement = document.querySelector(`[data-todo-id="${newTodo.id}"]`)
      if (newTodoElement) {
        gsap.fromTo(newTodoElement, 
          {
            scale: 0,
            opacity: 0,
            rotationY: 180
          },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
          }
        )
      }
    }, 50)

    // Animate the input field
    const inputElement = document.querySelector('.todo-input')
    gsap.to(inputElement, {
      scale: 1.05,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })
  }


  

  return (
    <>
      <Navbar/>
        <div ref={containerRef} className='container mx-auto my-5 rounded-xl p-5 bg-gradient-to-br from-slate-300 to-slate-500 min-h-[70vh] w-1/2 shadow-2xl backdrop-blur-sm float-animation'>
        <h1 ref={headerRef} className='font-bold text-center text-2xl mb-6 text-slate-800 drop-shadow-sm'>iTask - Manage your tasks at one place</h1>
          <div ref={addSectionRef} className='AddTODO flex flex-col gap-4 mb-8'>
            <h1 className='text-xl font-bold text-slate-700'>Add a Todo</h1>
            <input 
              onChange={handleChange} 
              value={todo} 
              className='todo-input rounded-lg w-auto h-[5vh] px-4 border-2 border-slate-300 focus:border-slate-600 focus:outline-none transition-all duration-300 shadow-sm' 
              type="text" 
              placeholder="Enter your task..."
            />
            <button 
              onClick={handleAdd} 
              disabled={todo.length<3} 
              className='font-bold text-xl rounded-xl py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:from-slate-900 disabled:to-slate-900 text-white shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95'
            >
              Save
            </button>
          </div>
          <div ref={todosRef}>
            <h2 className='text-xl font-bold py-5 text-slate-700'>YOUR TODOS</h2>
            <div className='bg-gradient-to-r from-slate-600 to-slate-800 h-1 rounded-full mb-4'></div>
            <div className='todos space-y-3'>
              {todos.length === 0 && (
                <div className='m-5 text-slate-600 text-center py-8 text-lg'>
                  No Todos To Display ✨
                </div>
              )}
              {todos.map(item =>{
                return(
                  <div 
                    key={item.id} 
                    data-todo-id={item.id}
                    className='todo flex justify-between items-center py-4 px-4 bg-white/50 rounded-lg backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-white/70 hover:scale-[1.02] transition-all duration-300 border border-slate-200'
                  >
                    <div className='flex gap-4 items-center flex-1'>
                      <input 
                        name={item.id} 
                        onChange={handlecheckbox} 
                        type="checkbox" 
                        checked={item.isCompleted}
                        className='w-5 h-5 rounded focus:ring-2 focus:ring-slate-500 cursor-pointer'
                      />
                      <div className={`todo-text flex-1 ${item.isCompleted ? "line-through text-slate-500" : "text-slate-800"} font-medium`}>
                        {item.todo}
                      </div>
                    </div>
                    <div className='buttons flex gap-2'>
                      <button 
                        onClick={(e) => handleEdit(e, item.id)} 
                        className='font-bold text-lg rounded-lg p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md transform hover:scale-110 transition-all duration-200 active:scale-95'
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className='font-bold text-lg rounded-lg p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md transform hover:scale-110 transition-all duration-200 active:scale-95'
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
    </>
  )
}

export default App
