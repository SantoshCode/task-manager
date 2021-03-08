import axios from 'axios'
import { TASKS_ROUTE } from '../backendUrl'
import localStorageHelper from '../utils/localStorageHelper'

const setConfig = () => {
	const token = localStorageHelper.loadUser().accessToken
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}
}

const fetchTasks = async () => {
	const response = await axios.get(TASKS_ROUTE, setConfig())
	return response.data
}
const createTask = async data => {
	await axios.post(TASKS_ROUTE, data, setConfig())
}

const fetchTaskById = async id => {
	const response = await axios.get(`${TASKS_ROUTE}/${id}`, setConfig())
	return response.data
}

const updateTask = async (id, data) => {
	await axios.patch(`${TASKS_ROUTE}/${id}`, data, setConfig())
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { fetchTasks, createTask, fetchTaskById, updateTask }
