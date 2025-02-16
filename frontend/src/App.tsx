import { RouterProvider } from 'react-router-dom'
import { publicRoutes } from './routes'
import { AppProvider } from './contexts/appContext'
// import Tiptap from './components/TipTap'
function App() {

    return (
        <AppProvider>
            <RouterProvider router={publicRoutes} />
            {/* <Tiptap /> */} 
        </AppProvider>
    )
}

export default App
