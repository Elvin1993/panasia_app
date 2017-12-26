import AppModel from './models/AppModel'
import Layout from './pages/Layout'
import NotFoundPage from './pages/NotFoundPage'
import ErrorPage from './pages/ErrorPage'
import LoginPage from './pages/LoginPage'
import LogonPage from './pages/LogonPage'
import BlankLayout from './pages/BlankLayout'

export default {
  models: {
    AppModel
  },
  pages: {
    Layout,
    NotFoundPage,
    ErrorPage,
    LoginPage,
    LogonPage,
    BlankLayout
  }
}
