const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("remaining-count")
const clearcompletedBtn = document.getElementById("clearCompletedBtn")

let todoText; // This should be populate when the user clicks on add button
let todos = [];
let todosString = localStorage.getItem("todos")
// If we have todos in the localStorage, we will read it 
if (todosString) {
    todos = JSON.parse(todosString)
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length
}
const populateTodos = () => {
    let string = "";

    let filteredTodos = todos;

    if (currentFilter === "active") {
        filteredTodos = todos.filter((todo) => {
            return todo.isCompleted === false;
        })
    }
    else if (currentFilter === "completed") {
        filteredTodos = todos.filter((todo) => {
            return todo.isCompleted === true;
        })
    }

    for (const todo of filteredTodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
                    <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
                    <span class="todo-text">${todo.title}</span>
                    <button class="delete-btn">×</button>
                </li>`
    }
    todoListUl.innerHTML = string


    // handle checkboxes logic
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")

    todoCheckboxes.forEach(async (element) => {
        element.addEventListener("click", async (e) => {
            if (e.target.checked) {
                element.parentNode.classList.add("completed")
                // Grab this todo from todo's array and set the isCompleted attribute as true
                todos = todos.map(todo => {
                    console.log(todo.id, element.parentNode.id)
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: true }
                    }
                    else {
                        return todo
                    }
                })
                console.log(todos)
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length
                localStorage.setItem("todos", JSON.stringify(todos))

            }
            else {
                const confirmation = confirm("Do you want unchecked it")
                if (confirmation) {   // ok-->unchecked
                    element.parentNode.classList.remove("completed")
                    // Grab this todo from todo's array and set the isCompleted attribute as false
                    todos = todos.map(todo => {
                        console.log(todo.id, element.parentNode.id)
                        if (todo.id == element.parentNode.id) {
                            return { ...todo, isCompleted: false }
                        }
                        else {
                            return todo
                        }
                    })
                    console.log(todos)
                    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length
                    localStorage.setItem("todos", JSON.stringify(todos))
                }
                else {
                    e.target.checked = true;  //cancel --> still checked
                }
            }
        })
    })


    // handle the clearCompletedBtn
    clearcompletedBtn.addEventListener("click", async () => {
        todos = todos.filter((todo) => todo.isCompleted == false)
        populateTodos()
        localStorage.setItem("todos", JSON.stringify(todos))

    })


    // handle delete buttons 
    let deleteBtns = document.querySelectorAll(".delete-btn")

    deleteBtns.forEach(async (element) => {
        element.addEventListener("click", async (e) => {
            const confirmation = confirm("Your todo is deleting...")
            if (confirmation) {
                console.log(e.target.parentNode.id)
                todos = todos.filter((todo) => {
                    return (todo.id) !== (e.target.parentNode.id)
                })
                console.log(todos)
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length
                localStorage.setItem("todos", JSON.stringify(todos))
                populateTodos()
            }
        })
    })
}


addTodoBtn.addEventListener("click", async () => {

    todoText = inputTag.value
    inputTag.value = ""
    // When title is too small
    if (todoText.trim().length < 4) {
        alert("Todo title is too small !!")
        return
    }
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos()
})

//add todo using enter key
inputTag.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        addTodoBtn.click();
    }
})

//handle filter buttons
let currentFilter = "all";

const filterbtns = document.querySelectorAll(".filter-btn")

filterbtns.forEach(async (button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterbtns.forEach((btn) => {
            btn.classList.remove("active")
        })
        button.classList.add("active")
        populateTodos()
    })
})

populateTodos()




