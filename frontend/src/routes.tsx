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
import Members from './pages/members/Members';
import ResetPassword from './pages/resetpassword/ResetPassword';
import Decision from './pages/decision/Decision';


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
                {/* <Route
                    path='portfolio/:meetingid'
                    element={
                        <Suspense fallback={<></>}>
                            <Portfolio />
                        </Suspense>
                    }
                /> */}
                <Route
                    path='portfolio'
                    element={
                        <Suspense fallback={<></>}>
                            <Portfolio />
                        </Suspense>
                    }
                />
                <Route path='news' element={<Suspense fallback={<></>}><News /></Suspense>} />
                <Route path='news/:id' element={<Suspense fallback={<></>}><Decision /></Suspense>} />

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
                <Route
                    path='members'
                    element={
                        <Suspense fallback={<></>}>
                            <Members />
                        </Suspense>
                    }
                />
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
            <Route
                path='/reset-password'
                element={
                    <Suspense fallback={<></>}>
                        <ResetPassword />
                    </Suspense>
                }
            />
            <Route
                path='/public/portfolio/:id'
                element={
                    <Suspense fallback={<></>}>
                        <div className='container'>
                            <header>
                                <div className='content-header'></div>
                            </header>
                            <main className='mt-12'>
                                <Portfolio />
                            </main>
                        </div>
                    </Suspense>
                }
            />
        </Route>
    )
)
