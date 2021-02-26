import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ErrorMessage from '../shared/components/ErrorMessage'
import { AuthContext } from '../shared/context/AuthContext'

export default function UpdateTaskPage() {
	const auth = useContext(AuthContext)
	const { token } = auth
	const { taskId } = useParams()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState()
	const [errorMessage, setErrorMessage] = useState()
	useEffect(() => {
		axios
			.get(`http://localhost:3000/tasks/${taskId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(res => {
				const { title, description, status } = res.data
				setTitle(title)
				setDescription(description)
				setStatus(status)
			})
			.catch(e => {
				setErrorMessage(e.response.data.message)
			})
	}, [taskId, token])

	const handleUpdate = async () => {
		try {
			await axios.patch(
				`http://localhost:3000/tasks/${taskId}`,
				{ title, description, status },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
		} catch (error) {
			setErrorMessage(error)
		}
	}
	return (
		<div>
			{errorMessage && <ErrorMessage message={errorMessage} />}

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
				<h1>{title}</h1>

				<p>{description}</p>

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
					onClick={handleUpdate}
				>
					Update
				</button>
			</form>
		</div>
	)
}
