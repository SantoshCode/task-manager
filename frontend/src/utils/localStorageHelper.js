const storageKeyUserDetaisl = 'userDetails'

const loadUser = () => JSON.parse(localStorage.getItem(storageKeyUserDetaisl))

const logoutUser = () => localStorage.removeItem(storageKeyUserDetaisl)

const storeUserDetailsInLocalStorage = userDetails => {
	const tokenExpDate = new Date(new Date().getTime() + 1000 * 60 * 60)
	const { userId, accessToken } = userDetails
	localStorage.setItem(
		storageKeyUserDetaisl,
		JSON.stringify({
			userId,
			accessToken,
			expiration: tokenExpDate,
		})
	)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	loadUser,
	logoutUser,
	storeUserDetailsInLocalStorage,
}
