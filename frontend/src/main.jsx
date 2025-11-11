import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
	<React.StrictMode>
		<ToastProvider>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/*" element={<App />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ToastProvider>
	</React.StrictMode>
)


