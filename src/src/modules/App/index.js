import AppModel from './models/AppModel'
import Layout from './pages/Layout'
import LoginPage from './pages/LoginPage'
import LogonPage from './pages/LogonPage'
import BlankLayout from './pages/BlankLayout'
import NotFoundPage from './pages/NotFoundPage'

export default {
  models: {
    AppModel
  },
  pages: {
    Layout,
    LoginPage,
    LogonPage,
    BlankLayout,
    NotFoundPage,
  }
}
