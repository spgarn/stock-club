import { Suspense } from 'react'
import {
    createHashRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'
import ClubLayout from './components/ClubLayout'
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Layout from './components/Layout';
import Home from './pages/home/Home';
import Portfolio from './pages/portfolio/Portfolio';
import News from './pages/decisions/Decisions';
import Templates from './pages/templates/Templates';
import Meeting from './pages/meeting/Meeting';
import UserManagement from './pages/userManagement/UserManagement';
import AdminRoute from './components/AdminRoute';


export const publicRoutes = createHashRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />}>
            {/* <Route
                index
                element={
                    <Suspense fallback={<></>}>
                        <Home />
                    </Suspense>
                }
            /> */}
            <Route path='/club' element={<ClubLayout />}>
                <Route
                    path='home'
                    element={
                        <Suspense fallback={<></>}>
                            <Home />
                        </Suspense>
                    }
                />
                <Route
                    path='portfolio'
                    element={
                        <Suspense fallback={<></>}>
                            <Portfolio />
                        </Suspense>
                    }
                />
                <Route
                    path='news'
                    element={
                        <Suspense fallback={<></>}>
                            <News />
                        </Suspense>
                    }
                />
                <Route
                    path='meeting/:id'
                    element={
                        <Suspense fallback={<></>}>
                            <Meeting />
                        </Suspense>
                    }
                />
                <Route
                    path='templates'
                    element={
                        <Suspense fallback={<></>}>
                            <Templates />
                        </Suspense>
                    }
                />
                <Route path='admin' element={<AdminRoute />}>
                    <Route
                        path='usermanagement'
                        element={
                            <Suspense fallback={<></>}>
                                <UserManagement />
                            </Suspense>
                        }
                    />
                </Route>
            </Route>

            <Route
                path='/login'
                element={
                    <Suspense fallback={<></>}>
                        <Login />
                    </Suspense>
                }
            />
            <Route
                path='/register'
                element={
                    <Suspense fallback={<></>}>
                        <Register />
                    </Suspense>
                }
            />
        </Route>
    )
)
