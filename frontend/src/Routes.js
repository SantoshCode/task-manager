import { Route, Switch, Redirect } from 'react-router-dom'
import CreateTaskPage from './features/tasks/CreateTaskPage'
import TasksPage from './features/tasks/TasksPage'
import Login from './features/user/Login'
import Signup from './features/user/Signup'
import UpdateTaskPage from './features/tasks/UpdateTaskPage'

export default function Routes({ token, setToken }) {
	return !token ? (
		<Switch>
			<Route exact path="/">
				<Login setToken={setToken} />
			</Route>
			<Route path="/signup" component={Signup} />
			<Redirect to="/" />
		</Switch>
	) : (
		<Switch>
			<Route path="/create-task" component={CreateTaskPage} />
			<Route path="/tasks" exact>
				<TasksPage setToken={setToken} />
			</Route>
			<Route path="/tasks/:taskId" component={UpdateTaskPage} />
			<Redirect to="/tasks" />
		</Switch>
	)
}
