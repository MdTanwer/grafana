import { store } from '@grafana/data';
import { t } from '@grafana/i18n';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { getGrafanaSearcher } from 'app/features/search/service/searcher';

import { SetupStep } from './types';

export const getSteps = (): SetupStep[] => [
  {
    heading: t('gettingstarted.steps.welcome-heading', 'Welcome to Grafana'),
    subheading: t(
      'gettingstarted.steps.welcome-subheading',
      'The steps below will guide you to quickly finish setting up your Grafana installation.'
    ),
    title: t('gettingstarted.steps.basic-title', 'Basic'),
    info: t(
      'gettingstarted.steps.welcome-info',
      'The steps below will guide you to quickly finish setting up your Grafana installation.'
    ),
    done: false,
    cards: [
      {
        type: 'tutorial',
        heading: t('gettingstarted.steps.datasource-tutorial-heading', 'Data source and dashboards'),
        title: t('gettingstarted.steps.grafana-fundamentals-title', 'Grafana fundamentals'),
        info: t(
          'gettingstarted.steps.grafana-fundamentals-info',
          'Set up and understand Grafana if you have no prior experience. This tutorial guides you through the entire process and covers the "Data source" and "Dashboards" steps to the right.'
        ),
        href: 'https://grafana.com/tutorials/grafana-fundamentals',
        icon: 'grafana',
        check: () => Promise.resolve(store.get('getting.started.grafana-fundamentals')),
        key: 'getting.started.grafana-fundamentals',
        done: false,
      },
      {
        type: 'docs',
        title: t('gettingstarted.steps.add-datasource-title', 'Add your first data source'),
        heading: t('gettingstarted.steps.datasource-heading', 'data sources'),
        icon: 'database',
        learnHref: 'https://grafana.com/docs/grafana/latest/features/datasources/add-a-data-source',
        href: 'datasources/new',
        check: () => {
          return new Promise((resolve) => {
            resolve(
              getDatasourceSrv()
                .getMetricSources()
                .filter((item) => {
                  return item.meta.builtIn !== true;
                }).length > 0
            );
          });
        },
        done: false,
      },
      {
        type: 'docs',
        heading: t('gettingstarted.steps.dashboard-heading', 'dashboards'),
        title: t('gettingstarted.steps.create-dashboard-title', 'Create your first dashboard'),
        icon: 'apps',
        href: 'dashboard/new',
        learnHref: 'https://grafana.com/docs/grafana/latest/guides/getting_started/#create-a-dashboard',
        check: async () => {
          const result = await getGrafanaSearcher().search({ limit: 1, kind: ['dashboard'] });
          return result.totalRows > 0;
        },
        done: false,
      },
    ],
  },
  {
    heading: t('gettingstarted.steps.setup-complete-heading', 'Setup complete!'),
    subheading: t(
      'gettingstarted.steps.setup-complete-subheading',
      'All necessary steps to use Grafana are done. Now tackle advanced steps or make the best use of this home dashboard – it is, after all, a fully customizable dashboard – and remove this panel.'
    ),
    title: t('gettingstarted.steps.advanced-title', 'Advanced'),
    info: t(
      'gettingstarted.steps.advanced-info',
      'Manage your users and teams and add plugins. These steps are optional'
    ),
    done: false,
    cards: [
      {
        type: 'tutorial',
        heading: t('gettingstarted.steps.users-heading', 'Users'),
        title: t('gettingstarted.steps.create-users-teams-title', 'Create users and teams'),
        info: t(
          'gettingstarted.steps.create-users-teams-info',
          'Learn to organize your users in teams and manage resource access and roles.'
        ),
        href: 'https://grafana.com/tutorials/create-users-and-teams',
        icon: 'users-alt',
        key: 'getting.started.create-users-and-teams',
        check: () => Promise.resolve(store.get('getting.started.create-users-and-teams')),
        done: false,
      },
      {
        type: 'docs',
        heading: t('gettingstarted.steps.plugins-heading', 'plugins'),
        title: t('gettingstarted.steps.install-plugins-title', 'Find and install plugins'),
        learnHref: 'https://grafana.com/docs/grafana/latest/plugins/installation',
        href: 'plugins',
        icon: 'plug',
        check: async () => {
          const plugins = await getBackendSrv().get('/api/plugins', { embedded: 0, core: 0 });
          return Promise.resolve(plugins.length > 0);
        },
        done: false,
      },
    ],
  },
];
