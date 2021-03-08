import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import taskService from '../../services/tasks'
import authService from '../../services/auth'
import ErrorMessage from '../shared/components/ErrorMessage'

export default function TasksPage({ setToken }) {
	const [tasks, setTasks] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const history = useHistory()

	useEffect(() => {
		let unmounted = false
		const fetchTasksFun = async () => {
			try {
				if (!unmounted) {
					setIsLoading(true)
					const responseData = await taskService.fetchTasks()
					setTasks(responseData)
					setIsLoading(false)
				}
			} catch (err) {
				if (!unmounted) {
					setIsLoading(false)
					setErrorMessage(err.response.data.message)
				}
			}
		}
		fetchTasksFun()

		return () => {
			unmounted = true
			setTasks(null)
			setErrorMessage(null)
			setIsLoading(null)
		}
	}, [])

	if (isLoading) return <h1>Loading...</h1>

	return (
		<>
			{errorMessage && <ErrorMessage message={errorMessage} />}
			<h1>Welcome </h1>
			<button
				onClick={() => {
					authService.logout()
					setToken(null)
				}}
			>
				Sign Out
			</button>
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
