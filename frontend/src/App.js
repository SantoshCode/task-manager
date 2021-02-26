import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import CreateTaskPage from './features/tasks/CreateTaskPage'
import { AuthContext } from './features/shared/context/AuthContext'
import TasksPage from './features/tasks/TasksPage'
import Login from './features/user/Login'
import Signup from './features/user/Signup'
import './App.css'
import useAuth from './features/shared/hooks/useAuth'
import UpdateTaskPage from './features/tasks/UpdateTaskPage'

function App() {
	const { token, login, logout, userId } = useAuth()

	let routes

	if (!token) {
		routes = (
			<Switch>
				<Route exact path="/" component={Login} />
				<Route path="/signup" component={Signup} />
				<Redirect to="/" />
			</Switch>
		)
	} else {
		routes = (
			<Switch>
				<Route path="/create-task" component={CreateTaskPage} />
				<Route path="/tasks" exact component={TasksPage} />
				<Route path="/tasks/:taskId" component={UpdateTaskPage} />
				<Redirect to="/tasks" />
			</Switch>
		)
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: !!token, login, logout, userId, token }}
		>
			<BrowserRouter>{routes}</BrowserRouter>
		</AuthContext.Provider>
	)
}

export default App
