import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import localStorageHelper from './utils/localStorageHelper'
// import authService from './services/auth'
import './App.css'

let logoutTimer

function App() {
	const [token, setToken] = useState()
	const [tokenExpirationDate, setTokenExpirationDate] = useState(null)

	const logout = useCallback(() => {
		setToken(null)
		setTokenExpirationDate(null)
		localStorageHelper.logoutUser()
	}, [])

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime()
			logoutTimer = setTimeout(logout, remainingTime)
		} else {
			clearTimeout(logoutTimer)
		}
	}, [logout, token, tokenExpirationDate])

	useEffect(() => {
		const storedData = localStorageHelper.loadUser()

		if (
			storedData &&
			storedData.accessToken &&
			new Date(storedData.expiration) > new Date()
		) {
			setToken(storedData.accessToken)
		}
	}, [])

	return (
		<BrowserRouter>
			<Routes token={token} setToken={setToken} />
		</BrowserRouter>
	)
}

export default App
