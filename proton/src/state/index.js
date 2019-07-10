import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './root/auth/reducers';
import router from './root/router/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';
import user from './root/user/reducers';
import workspacesBar from './root/workspaces-bar/reducers';

import dialogs from './dialogs/reducers';
import pages from './pages/reducers';

const rootReducer = combineReducers({
  auth,
  router,
  snackbar,
  updater,
  user,
  workspacesBar,
  dialogs,
  pages,
});

const configureStore = initialState =>
  createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

// init store
const store = configureStore();

export default store;
