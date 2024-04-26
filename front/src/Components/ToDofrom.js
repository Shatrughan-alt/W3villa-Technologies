import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ToDoForm() {
  const navigate = useNavigate();

  const [todoData, setTodoData] = useState([]);
  const [todo, setTodo] = useState({
    title: '',
    descreption: ''
  });
  const [updatetodo, setupdateTodo] = useState({
    title: '',
    descreption: ''
  });
  const [editTodoId, setEditTodoId] = useState(null);

  const fetchTodoData = async () => {
    try {
      const res = await fetch('/userdata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setTodoData(data.todo)
     console.log(data);
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchTodoData();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value
    });
  };
  const handleupdatetodo = (e) => {
    setupdateTodo({
      ...updatetodo,
      [e.target.name]: e.target.value
    });
  };

  const addTodo = async (e) => {
    e.preventDefault();
    const { title, descreption } = todo;

    const res = await fetch('/addtodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, descreption })
    });

    await res.json();
    if (res.status === 422) {
      console.log('Fill the form');
    } else {
      console.log('Success');
      setTodo({ title: '', descreption: '' });
      fetchTodoData();
    }
  };

  const deleteTodo = async (id) => {
    if (window.confirm('Are You Sure to delete todo')) {
      const res = await fetch('/deletetodo/' + id, {
        method: 'DELETE'
      });

      if (res.status === 200) {
        console.log('Delete success');
        fetchTodoData();
      } else {
        console.log('Not Deleted');
      }
    }
  };

  const editTodo = async (id) => {
    setEditTodoId(id);
    const todoToEdit = todoData.find(todo => todo._id === id);
    setTodo({
      title: todoToEdit.title,
      descreption: todoToEdit.descreption
    });
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    try {
      const { title, descreption } = updatetodo;
      const res = await fetch('/updatetodo/' + editTodoId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, descreption })
      });
      await res.json();
      console.log(res.data);
      if (res.status === 422) {
        console.log('Fill all the fields');
      } else if (res.status === 200) {
        console.log('Todo update success');
        fetchTodoData();
        setEditTodoId(null);
        setTodo({
          title: '',
          descreption: ''
        });
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className='customerheading'>Task Manager Web Application</h1>
      <form  onSubmit={addTodo}>
      <div className='selinp'>
        <input type="text" placeholder='Title' name='title' autoComplete='off' value={todo.title} onChange={handleInputChange} />
        <input type="text" placeholder='Description' name='descreption' value={todo.descreption} onChange={handleInputChange} />
        <div className='task'>
            <button type="submit">Add Task</button>
          </div>

          


            </div>
      </form>

      <div className="todo-data">
        <table>
          <thead>
            <tr>
              <th>SNO.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((todo, index) => (
              <tr key={todo._id}>
                <td>{index + 1}.</td>
                <td>{todo.title}</td>
                <td>{todo.descreption}</td>
                <td><button className='btn' onClick={() => deleteTodo(todo._id)}>Delete</button></td>
                <td><button className='btn' onClick={() => editTodo(todo._id)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editTodoId && (
        <div className="edit-todo">
          <h2 className='customerheading1'>Edit Task</h2>
          <form onSubmit={updateTodo}>
            <div className='selinp'>
            <input type="text" placeholder='Title' name='title' autoComplete='off' value={updatetodo.title} onChange={handleupdatetodo} />
            <input type="text" placeholder='Description' name='descreption' value={updatetodo.descreption} onChange={handleupdatetodo} />
              <div className='task'>
                <button type="submit">Update Task</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
