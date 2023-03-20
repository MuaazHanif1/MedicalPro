
import './styles/quasar.scss'
import '@quasar/extras/material-icons/material-icons.css'
import { Notify } from 'quasar'
import iconSet from 'quasar/icon-set/material-icons'

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    notify: {
      timeout: 1000
    },
    screen: {
      bodyClasses: true,
    },
  },
  plugins: {
    Notify
  },
  iconSet: iconSet,
}