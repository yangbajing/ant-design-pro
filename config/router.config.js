export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/job/jobs' },
      // job
      {
        name: 'job',
        path: '/job',
        icon: 'table',
        routes: [
          { path: '/job', redirect: '/job/jobs' },
          { path: '/job/jobs', name: 'jobs', component: './Job/Jobs' },
          {
            path: '/job/item/:jobKey',
            hideInMenu: true,
            name: 'item',
            component: './Job/JobItem',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
