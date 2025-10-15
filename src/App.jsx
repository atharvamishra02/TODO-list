import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { gsap } from "gsap";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const bubblesContainerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos")) 
      setTodos(todos)
    }

    // Create floating bubbles animation
    createFloatingBubbles()

    // Pause animations when page is not visible for better performance
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const createFloatingBubbles = () => {
    if (!bubblesContainerRef.current) return

    const container = bubblesContainerRef.current
    
    // Reduce bubbles on mobile for better performance
    const isMobile = window.innerWidth < 768
    const numberOfBubbles = isMobile ? 8 : 12

    // Clear any existing bubbles
    container.innerHTML = ''

    for (let i = 0; i < numberOfBubbles; i++) {
      const bubble = document.createElement('div')
      bubble.className = 'bubble'
      
      // Adjust bubble size for mobile
      const maxSize = isMobile ? 50 : 80
      const minSize = isMobile ? 15 : 20
      const size = Math.random() * maxSize + minSize
      
      // Random position
      const startX = Math.random() * window.innerWidth
      const startY = window.innerHeight + 100
      
      // Random colors for bubbles
      const colors = [
        'rgba(59, 130, 246, 0.1)',   // Blue
        'rgba(147, 51, 234, 0.1)',   // Purple  
        'rgba(236, 72, 153, 0.1)',   // Pink
        'rgba(34, 197, 94, 0.1)',    // Green
        'rgba(251, 191, 36, 0.1)',   // Yellow
        'rgba(239, 68, 68, 0.1)',    // Red
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      bubble.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        backdrop-filter: blur(${isMobile ? 5 : 10}px);
        box-shadow: 
          inset 0 0 ${isMobile ? 10 : 20}px rgba(255, 255, 255, 0.2),
          0 0 ${isMobile ? 10 : 20}px rgba(255, 255, 255, 0.1);
        pointer-events: none;
        z-index: 1;
        will-change: transform;
      `
      
      container.appendChild(bubble)
      
      // Animate each bubble
      gsap.set(bubble, { x: startX, y: startY })
      
      // Optimize animation duration for mobile
      const animationDuration = isMobile ? Math.random() * 6 + 8 : Math.random() * 8 + 5
      
      gsap.to(bubble, {
        y: -200,
        x: startX + (Math.random() - 0.5) * (isMobile ? 200 : 400),
        rotation: isMobile ? Math.random() * 180 : Math.random() * 360,
        duration: animationDuration,
        ease: "none",
        repeat: -1,
        delay: Math.random() * 5,
        onRepeat: () => {
          // Reset position when animation repeats
          gsap.set(bubble, { 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotation: 0
          })
        }
      })

      // Reduce floating motion on mobile
      if (!isMobile || Math.random() > 0.5) {
        gsap.to(bubble, {
          x: `+=${(Math.random() - 0.5) * (isMobile ? 50 : 100)}`,
          duration: Math.random() * 4 + 3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        })
      }

      // Reduce scale pulsing on mobile
      if (!isMobile || Math.random() > 0.6) {
        gsap.to(bubble, {
          scale: Math.random() * 0.3 + 0.85,
          duration: Math.random() * 3 + 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        })
      }

      // Add sparkle effect
      if (Math.random() > 0.7) {
        const sparkle = document.createElement('div')
        sparkle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        `
        sparkle.className = 'sparkle'
        bubble.appendChild(sparkle)
      }
    }

    // Add throttled resize handler to optimize performance
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        createFloatingBubbles()
      }, 250)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }
  
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }
  
  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }

  const createBurstEffect = (element) => {
    const burst = document.createElement('div')
    const rect = element.getBoundingClientRect()
    
    burst.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 10px;
      height: 10px;
      background: radial-gradient(circle, #34d399, #10b981);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
    `
    
    document.body.appendChild(burst)
    
    gsap.to(burst, {
      scale: 8,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        burst.remove()
      }
    })
  }

  const handlecheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS()
    
    // Create burst effect when checking todo
    if (newTodos[index].isCompleted) {
      createBurstEffect(e.target)
    }
  }

  const createShootingStar = () => {
    const star = document.createElement('div')
    star.style.cssText = `
      position: fixed;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
      pointer-events: none;
      z-index: 5;
    `
    
    const startX = Math.random() * window.innerWidth
    const startY = -10
    const endX = startX + (Math.random() - 0.5) * 500
    const endY = window.innerHeight + 10
    
    document.body.appendChild(star)
    
    gsap.set(star, { x: startX, y: startY })
    gsap.to(star, {
      x: endX,
      y: endY,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        star.remove()
      }
    })
  }

  const handleAdd = () => {
    const newTodo = {id: uuidv4(), todo, isCompleted: false}
    setTodos([...todos, newTodo])
    setTodo("")
    saveToLS()
    
    // Create shooting star effect when adding todo
    createShootingStar()
    setTimeout(createShootingStar, 200)
  }

  return (
    <>
      {/* Floating Bubbles Background */}
      <div 
        ref={bubblesContainerRef} 
        className="bubbles-container fixed inset-0 overflow-hidden pointer-events-none z-0"
      ></div>
      
      <Navbar/>
      <div className='container mx-auto my-4 sm:my-8 rounded-2xl p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/20 to-white/5 min-h-[75vh] w-full max-w-4xl sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 backdrop-blur-lg relative z-10 border border-white/30 shadow-2xl'>
        <h1 className='font-bold text-center text-2xl sm:text-3xl mb-6 sm:mb-8 text-white drop-shadow-lg bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent px-2'>
          <span className='hidden sm:inline'>✨ iTask - Manage your tasks at one place ✨</span>
          <span className='sm:hidden'>✨ iTask ✨</span>
        </h1>
        
        <div className='AddTODO flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-10 p-4 sm:p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg'>
          <h2 className='text-xl sm:text-2xl font-bold text-white drop-shadow-md flex items-center gap-2'>
            <span className='text-xl sm:text-2xl'>📝</span> 
            <span className='hidden sm:inline'>Add a New Task</span>
            <span className='sm:hidden'>New Task</span>
          </h2>
          
          <div className='relative'>
            <input 
              onChange={handleChange} 
              value={todo} 
              className='w-full h-12 sm:h-14 px-4 sm:px-6 text-base sm:text-lg bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white/40 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg placeholder-gray-500 font-medium touch-manipulation' 
              type="text" 
              placeholder="Add your task ✨"
            />
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 pointer-events-none'></div>
          </div>
          
          <button 
            onClick={handleAdd} 
            disabled={todo.length < 3} 
            className='relative overflow-hidden font-bold text-lg sm:text-xl rounded-2xl py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white shadow-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 active:scale-95 border border-white/20 touch-manipulation'
          >
            <span className='relative z-10 flex items-center justify-center gap-2'>
              <span className='text-lg sm:text-xl'>💾</span>
              <span className='hidden sm:inline'>
                {todo.length >= 3 ? 'Save Task' : 'Type at least 3 characters...'}
              </span>
              <span className='sm:hidden'>
                {todo.length >= 3 ? 'Save' : 'Need 3+ chars'}
              </span>
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
          </button>
        </div>

        <div className='p-4 sm:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20'>
          <h2 className='text-xl sm:text-2xl font-bold py-2 sm:py-4 text-white drop-shadow-md flex items-center gap-2'>
            <span className='text-xl sm:text-2xl'>📋</span> 
            <span className='hidden sm:inline'>Your Tasks ({todos.length})</span>
            <span className='sm:hidden'>Tasks ({todos.length})</span>
          </h2>
          <div className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-1 rounded-full mb-4 sm:mb-6 shadow-lg'></div>
          <div className='todos space-y-3 sm:space-y-4 max-h-96 sm:max-h-none overflow-y-auto'>
            {todos.length === 0 && (
              <div className='text-center py-8 sm:py-12 text-white/80'>
                <div className='text-4xl sm:text-6xl mb-2 sm:mb-4'>📝</div>
                <div className='text-lg sm:text-xl font-medium'>No tasks yet!</div>
                <div className='text-sm sm:text-lg text-white/60 mt-1 sm:mt-2 px-4'>Add your first task above to get started ✨</div>
              </div>
            )}
            {todos.map(item => {
              return(
                <div 
                  key={item.id} 
                  className={`todo flex justify-between items-center py-3 sm:py-5 px-4 sm:px-6 bg-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm ${item.isCompleted ? 'bg-green-400/20 border-green-400/40' : ''}`}
                >
                  <div className='flex gap-3 sm:gap-5 items-center flex-1 min-w-0'>
                    <div className='relative flex-shrink-0'>
                      <input 
                        name={item.id} 
                        onChange={handlecheckbox} 
                        type="checkbox" 
                        checked={item.isCompleted}
                        className='w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 border-white/50 bg-white/20 checked:bg-gradient-to-r checked:from-green-400 checked:to-green-500 focus:ring-2 focus:ring-green-400/50 cursor-pointer transition-all duration-300 touch-manipulation'
                      />
                      {item.isCompleted && (
                        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                          <span className='text-white text-xs sm:text-sm'>✓</span>
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 text-sm sm:text-lg ${item.isCompleted ? "line-through text-white/60" : "text-white"} font-medium transition-all duration-300 break-words`}>
                      {item.todo}
                    </div>
                    {item.isCompleted && (
                      <span className='text-xl sm:text-2xl animate-bounce flex-shrink-0'>🎉</span>
                    )}
                  </div>
                  <div className='buttons flex gap-2 sm:gap-3 flex-shrink-0 ml-2'>
                    <button 
                      onClick={(e) => handleEdit(e, item.id)} 
                      className='font-bold text-sm sm:text-lg rounded-xl p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 border border-white/20 touch-manipulation'
                      title="Edit task"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className='font-bold text-sm sm:text-lg rounded-xl p-2 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 border border-white/20 touch-manipulation'
                      title="Delete task"
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