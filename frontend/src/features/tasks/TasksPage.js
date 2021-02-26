import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ErrorMessage from '../shared/components/ErrorMessage'
import { AuthContext } from '../shared/context/AuthContext'

export default function TasksPage() {
	const auth = useContext(AuthContext)
	const { token, logout } = auth
	const [tasks, setTasks] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [loading, setLoading] = useState(true)
	const history = useHistory()

	useEffect(() => {
		axios
			.get('http://localhost:3000/tasks', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(res => {
				const tasks = res.data
				setTasks(tasks)
			})
			.catch(e => {
				setErrorMessage(e.response.data.message)
			})
		setLoading(false)
	}, [token])

	if (loading) return <h1>Loading...</h1>

	return (
		<>
			{errorMessage && <ErrorMessage message={errorMessage} />}
			<h1>Welcome </h1>
			<button onClick={logout}>Sign Out</button>
			<button
				style={{ margin: '1em' }}
				onClick={() => {
					history.push('/create-task')
				}}
			>
				<Link style={{ textDecoration: 'none' }} to="/tasks/create">
					Add a new Task
				</Link>
			</button>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
				}}
			>
				{tasks.map(task => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							margin: '1em',
							border: '1px solid red',
							padding: '10px',
						}}
						key={task.id}
					>
						<h2>{task.title}</h2>
						<p>{task.description}</p>
						<small>{task.status}</small>
						<Link to={`/tasks/${task.id}`}>Edit</Link>
					</div>
				))}
			</div>
		</>
	)
}
