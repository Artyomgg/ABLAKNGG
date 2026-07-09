import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Admin from './Admin'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/admin' element={<Admin />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
)
