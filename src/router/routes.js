/* eslint-disable max-len */

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Index', component: () => import('pages/Index.vue') },
      { path: 'admin/system-objects', name: 'SystemObjects', component: () => import('components/admin/system-objects') },
      { path: 'admin/system-objects-actions', name: 'SystemObjectsActions', component: () => import('components/admin/system-objects-actions') },
      { path: 'admin/roles', name: 'Roles', component: () => import('components/admin/roles') },
      { path: 'admin/users', name: 'Users', component: () => import('components/admin/users') },
      { path: 'admin/collections', name: 'Collections', component: () => import('components/admin/collections') },

      { path: 'directory/customers', name: 'Customers', component: () => import('components/directory/customers') },
      { path: 'directory/countries', name: 'Countries', component: () => import('components/directory/countries') },
      // { path: 'directory/test-objects', name: 'TestObjects', component: () => import('components/directory/test-objects') },
      // { path: 'directory/delivery-methods', name: 'DeliveryMethods', component: () => import('components/directory/delivery-methods') },
      // { path: 'directory/couriers', name: 'Couriers', redirect: '' },
      // { path: 'directory/samples', name: 'Samples', redirect: '' },

      { path: 'catalog/master-schedules/:year', name: 'MasterSchedules', component: () => import('components/catalog/master-schedules') },
      // { path: 'catalogs/studies', name: 'Studies', component: () => import('components/catalogs/studies') },
      // { path: 'catalogs/standard-samples', name: 'StandardSamples', component: () => import('components/catalogs/standard-samples') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
