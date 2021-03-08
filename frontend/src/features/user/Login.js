import React, { useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import authService from '../../services/auth'
import localStorageHelper from '../../utils/localStorageHelper'
import ErrorMessage from '../shared/components/ErrorMessage'

const actions = {
	INPUT_CHANGE: 'INPUT_CHANGE',
	SET_LOADING_FALSE: 'SET_LOADING_FALSE',
	SET_LOADING_TRUE: 'SET_LOADING_TRUE',
	SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
	CLEAN_ERROR_MESSAGE: 'CLEAN_ERROR_MESSAGE',
	CLEAN_STATE: 'CLEAN_STATE',
}
const types = {
	USERNAME: 'username',
	PASSWORD: 'password',
}
const reducer = (state, action) => {
	switch (action.type) {
		case actions.INPUT_CHANGE:
			return {
				...state,
				[action.payload.key]: action.payload.value,
			}
		case actions.SET_LOADING_FALSE:
			return {
				...state,
				isLoading: false,
			}
		case actions.SET_LOADING_TRUE:
			return {
				...state,
				isLoading: true,
			}
		case actions.SET_ERROR_MESSAGE:
			return {
				...state,
				errorMessage: action.payload.value,
			}
		case actions.CLEAN_STATE:
			return {}
		default:
			return state
	}
}

export default function Login({ setToken }) {
	const [state, dispatch] = useReducer(reducer, {
		username: '',
		password: '',
		isLoading: false,
		errorMessage: '',
	})

	const handleSignIn = async e => {
		e.preventDefault()
		try {
			dispatch({ type: actions.SET_LOADING_TRUE })
			const responseData = await authService.login({
				username: state.username,
				password: state.password,
			})
			const { userId, accessToken } = responseData
			setToken(accessToken)
			localStorageHelper.storeUserDetailsInLocalStorage({
				userId,
				accessToken,
			})
			dispatch({ type: actions.SET_LOADING_FALSE })
			dispatch({ type: actions.CLEAN_ERROR_MESSAGE })
		} catch (error) {
			dispatch({ type: actions.SET_LOADING_FALSE })
			dispatch({
				type: actions.SET_ERROR_MESSAGE,
				payload: { value: error.response.data.message },
			})
		}
	}

	useEffect(() => {
		return () => {
			dispatch({ type: actions.CLEAN_STATE })
		}
	}, [])

	const handleChange = (actionType, inputType, value) => {
		dispatch({
			type: actionType,
			payload: { key: inputType, value },
		})
	}

	if (state.isLoading) return <h1>Loading...</h1>

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
			{state.errorMessage && (
				<ErrorMessage message={state.errorMessage} />
			)}
			<label>Username</label>
			<input
				style={{ padding: '1rem', fontSize: '1em' }}
				type="text"
				placeholder="username"
				value={state.username}
				onChange={e =>
					handleChange(
						actions.INPUT_CHANGE,
						types.USERNAME,
						e.target.value
					)
				}
			/>
			<label>Password</label>
			<input
				style={{ padding: '1rem', fontSize: '1em' }}
				type="password"
				placeholder="password"
				value={state.password}
				onChange={e =>
					handleChange(
						actions.INPUT_CHANGE,
						types.PASSWORD,
						e.target.value
					)
				}
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
