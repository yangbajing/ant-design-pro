import { queryOptionAll } from '@/services/job';
import { queryCurrent } from '@/services/user';

queryCurrent().then(payload => {
  const { _store: store } = window.g_app;
  store.dispatch({
    type: 'user/saveCurrentUser',
    payload,
  });
});
queryOptionAll().then(payload => {
  const { _store: store } = window.g_app;
  store.dispatch({
    type: 'job/saveOptionAll',
    payload,
  });
});
