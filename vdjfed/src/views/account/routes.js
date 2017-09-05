import Blank from '@/components/template/Blank'
import Me from './Me'
import Profile from './Profile'

export default {
  path: 'account',
  component: Blank,
  meta: {
    auth: true
  },
  children: [{
    path: 'me',
    name: 'account.me',
    meta: {
      name: 'Me'
    },
    component: Me
  }, {
    path: 'profile',
    name: 'account.profile',
    meta: {
      name: 'Profile',
      auth: ['admin']
    },
    component: Profile
  }]
}
