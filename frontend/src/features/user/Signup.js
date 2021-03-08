import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../../services/auth'
import ErrorMessage from '../shared/components/ErrorMessage'

export default function Signup() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleSignUp = async e => {
		e.preventDefault()
		try {
			await authService.register({ username, password })
		} catch (error) {
			setErrorMessage(error.response.data.message)
		}
	}

	useEffect(() => {
		return () => {
			setUsername(null)
			setPassword(null)
			setErrorMessage(null)
		}
	}, [])

	return (
		<form
			onSubmit={handleSignUp}
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
			<label>Username</label>
			<input
				style={{ padding: '1rem', fontSize: '1em' }}
				type="text"
				placeholder="username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<label>Password</label>
			<input
				style={{ padding: '1rem', fontSize: '1em' }}
				type="password"
				placeholder="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button
				type="submit"
				style={{
					padding: '10px 15px',
					margin: '1em',
					fontSize: '1em',
				}}
			>
				Sign Up
			</button>
			<p>
				Already have an account? <Link to="/">Login</Link>
			</p>
		</form>
	)
}
