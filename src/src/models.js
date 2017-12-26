import App from './modules/App/models'
import Demo from './modules/Demo/models'
import My from './modules/My/models'

const models = {
  ...App,
  ...My,
  ...Demo
}
export default models
