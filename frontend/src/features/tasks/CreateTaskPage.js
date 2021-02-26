import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../shared/components/ErrorMessage'
import useAuth from '../shared/hooks/useAuth'

export default function CreateTaskPage() {
	const auth = useAuth()
	const { token } = auth
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState('OPEN')
	const [errorMessage, setErrorMessage] = useState('')

	const handleTaskSubmit = async e => {
		e.preventDefault()
		try {
			setErrorMessage(null)
			await axios.post(
				`http://localhost:3000/tasks`,
				{ title, description, status },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
		} catch (error) {
			setErrorMessage(error.response.data.message)
		}
	}

	return (
		<>
			<button>
				<Link to="/tasks">See all the tasks</Link>
			</button>
			<form
				style={{
					display: 'flex',
					flexDirection: 'column',
					textAlign: 'center',
					alignItems: 'center',
					marginTop: '40vh',
					fontSize: '1.8em',
				}}
			>
				{errorMessage && <ErrorMessage message={errorMessage} />}
				<label>Title</label>
				<input
					style={{ padding: '1rem', fontSize: '1em' }}
					type="text"
					placeholder="title"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<label>Description</label>
				<textarea
					style={{ padding: '1rem', fontSize: '1em' }}
					placeholder="description"
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<label>Status</label>
				<select
					value={status}
					onChange={e => setStatus(e.target.value)}
				>
					<option value="OPEN">OPEN</option>
					<option value="IN_PROGRESS">IN_PROGRESS</option>
					<option value="DONE">DONE</option>
				</select>
				<button
					type="submit"
					style={{
						padding: '10px 15px',
						margin: '1em',
						fontSize: '1em',
					}}
					onClick={handleTaskSubmit}
				>
					Create
				</button>
			</form>
		</>
	)
}
