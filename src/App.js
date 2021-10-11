import { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import Layout from './components/Layout/Layout';

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import KeyManagementPage from './pages/KeyManagementPage';
import LocalCryptoPage from './pages/LocalCryptoPage';
import { AuthContext } from './store/auth-context';
import FileSharingPage from './pages/FileSharingPage';
import HomePage from './pages/HomePage';

function App() {

  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <div className="App">
      <Layout>
        <Switch>
          {!isLoggedIn &&
            <Route path='/login' exact>
              <LoginPage></LoginPage>
            </Route>
          }
          {!isLoggedIn &&
            <Route path='/register' exact>
              <RegistrationPage></RegistrationPage>
            </Route>
          }
          {isLoggedIn &&
            <Route path='/home' exact>
              <HomePage></HomePage>
            </Route>
          }
          {isLoggedIn &&
            <Route path='/keys' exact>
              <KeyManagementPage></KeyManagementPage>
            </Route>
          }
          {isLoggedIn &&
            <Route path='/files' exact>
              <FileSharingPage></FileSharingPage>
            </Route>
          }
          {isLoggedIn &&
            <Route path='/crypto' exact>
              <LocalCryptoPage></LocalCryptoPage>
            </Route>
          }
          {!isLoggedIn &&
            <Route path='*'>
              <Redirect to='/login'></Redirect>
            </Route>
          }
          {isLoggedIn &&
            <Route path='/*' exact>
              <Redirect to='/keys'></Redirect>
            </Route>
          }
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
