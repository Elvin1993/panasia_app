import Activity from './modules/Activity/models'
import App from './modules/App/models'
import Article from './modules/Article/models'
import Edu from './modules/Edu/models'
import My from './modules/My/models'
// import College from './modules/College/models'
// import Demo from './modules/Demo/models'
// import Migrate from './modules/Migrate/models'
// import Shop from './modules/Shop/models'
// import User from './modules/User/models'

const models = {
  ...App,
  ...My,
  ...Article,
  ...Edu,
  ...Activity,
  // ...User,
  // ...Shop,
  // ...Demo,
  // ...Migrate,
  // ...College
}
export default models
