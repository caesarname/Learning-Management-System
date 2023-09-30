import { SignUp } from '../views/signUp'
import { SignIn } from '../views/signIn'
import { ResetPassword } from '../views/resetPassword'
import { ResetPassword2 } from '../views/resetPassword2'

const routes = [
    { path: '/index', exact: true, name: 'SignIn', component: SignIn, auth: [1] },
    { path: '/SignUp', exact: false, name: 'SignUp', component: SignUp, auth: [1] },
    { path: '/ResetPassword', exact: false, name: 'ResetPassword', component: ResetPassword, auth: [1] },
    { path: '/ResetPassword2', exact: false, name: 'ResetPassword2', component: ResetPassword2, auth: [1] },
]

export default routes