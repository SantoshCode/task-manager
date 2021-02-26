import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../shared/components/ErrorMessage'
import { AuthContext } from '../shared/context/AuthContext'

export default function Login() {
	const auth = useContext(AuthContext)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleSignIn = async e => {
		e.preventDefault()
		try {
			setErrorMessage(null)
			const res = await axios.post(`http://localhost:3000/auth/signin`, {
				username,
				password,
			})
			const { userId, accessToken } = res.data
			auth.login(userId, accessToken)
		} catch (error) {
			setErrorMessage(error.response.data.message)
		}
	}

	return (
		<form
			onSubmit={handleSignIn}
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
				Sign In
			</button>
			<p>
				Don't have an account? <Link to="/signup">Create Account</Link>
			</p>
		</form>
	)
}
