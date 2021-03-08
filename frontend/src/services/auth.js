import axios from 'axios'
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '../backendUrl'
import localStorageHelper from '../utils/localStorageHelper'

const login = async credential => {
	const response = await axios.post(SIGNIN_ROUTE, credential)
	return response.data
}

const register = async enteredData => {
	const response = await axios.post(SIGNUP_ROUTE, enteredData)
	return response.data
}

const logout = () => {
	localStorageHelper.logoutUser()
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, register, logout }
