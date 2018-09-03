import App from './views/App';
import Events from './views/Events';
import EventsErstellen from './views/Events/EventsErstellen';
import Gruppen from './views/Gruppen';
import GruppeErstellen from './views/Gruppen/GruppeErstellen';
import Profil from './views/Profil';
import Login from './views/Login';
import SignUp from './views/SignUp';
import Auth from './modules/Auth';


const routes = {
  component: App,
  childRoutes: [

    {
      path: '/',
      component: Events,
      onEnter: (nextState, replace) => {
        if (!Auth.isUserAuthenticated()) {
          replace('/login');
        }
      },
    },
    {
      path: '/eventserstellen',
      component: EventsErstellen,
      onEnter: (nextState, replace) => {
        if (!Auth.isUserAuthenticated()) {
          replace('/login');
        }
      },
    },
    {
      path: '/gruppen',
      component: Gruppen,
      onEnter: (nextState, replace) => {
        if (!Auth.isUserAuthenticated()) {
          replace('/login');
        }
      },
    },
    {
      path: '/gruppeerstellen',
      component: GruppeErstellen,
      onEnter: (nextState, replace) => {
        if (!Auth.isUserAuthenticated()) {
          replace('/login');
        }
      },
    },
    {
      path: '/profil',
      component: Profil,
      onEnter: (nextState, replace) => {
        if (!Auth.isUserAuthenticated()) {
          replace('/login');
        }
      },
    },

    {
      path: '/login',
      component: Login,
    },

    {
      path: '/signup',
      component: SignUp,
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        localStorage.setItem('currentUser', '');
        replace('/');
      },
    },

  ],
};

export default routes;
