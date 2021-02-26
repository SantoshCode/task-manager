import { useCallback, useEffect, useState } from 'react'

let logoutTimer

export default function useAuth() {
	const [token, setToken] = useState()
	const [tokenExpirationDate, setTokenExpirationDate] = useState(null)
	const [userId, setUserId] = useState(null)

	const login = useCallback((uid, token, expirationTime) => {
		setToken(token)
		setUserId(uid)
		const tokenExpirationDate =
			expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60)
		setTokenExpirationDate(tokenExpirationDate)
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				expiration: tokenExpirationDate.toISOString(),
			})
		)
	}, [])

	const logout = useCallback(() => {
		setToken(null)
		setTokenExpirationDate(null)
		setUserId(null)
		localStorage.removeItem('userData')
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
		const storedData = JSON.parse(localStorage.getItem('userData'))
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expiration)
			)
		}
	}, [login])

	return { token, login, logout, userId }
}
