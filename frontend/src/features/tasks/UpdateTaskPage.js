import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ErrorMessage from '../shared/components/ErrorMessage'
import taskService from '../../services/tasks'

export default function UpdateTaskPage() {
	const { taskId } = useParams()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState('')
	const [updated, setUpdated] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		let unmounted = false
		const fetchTask = async () => {
			try {
				if (!unmounted) {
					const responseData = await taskService.fetchTaskById(taskId)
					const { title, description, status } = responseData
					setTitle(title)
					setDescription(description)
					setStatus(status)
				}
			} catch (error) {
				if (!unmounted) {
					setErrorMessage(error.response.data.message)
				}
			}
		}
		fetchTask()
		return () => {
			unmounted = true
			setTitle(null)
			setDescription(null)
			setStatus(null)
			setErrorMessage(null)
			setUpdated(null)
		}
	}, [taskId])

	const handleUpdate = async () => {
		try {
			await taskService.updateTask(taskId, {
				title,
				description,
				status: status ? status : 'OPEN',
			})
			setUpdated(true)
		} catch (error) {}
	}

	return (
		<div>
			{updated && (
				<h1 style={{ background: 'green', color: 'white' }}>
					Task Updated
				</h1>
			)}

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
