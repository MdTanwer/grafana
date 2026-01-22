import { RuleFormType } from '../../../types/rule-form';

type FormDescriptions = {
  sectionTitle: string;
  helpLabel: string;
  helpContent: string;
  helpLink: string;
};

const getDescriptions = (): Record<RuleFormType, FormDescriptions> => {
  const { t } = require('@grafana/i18n');

  return {
    [RuleFormType.cloudRecording]: {
      sectionTitle: t('alerting.query-step.define-recording-rule', 'Define recording rule'),
      helpLabel: t('alerting.query-step.define-your-recording-rule', 'Define your recording rule'),
      helpContent: t(
        'alerting.query-step.recording-rule-help-content',
        'Pre-compute frequently needed or computationally expensive expressions and save their result as a new set of time series.'
      ),
      helpLink: 'https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-recording-rules/',
    },
    [RuleFormType.grafanaRecording]: {
      sectionTitle: t('alerting.query-step.define-recording-rule', 'Define recording rule'),
      helpLabel: t('alerting.query-step.define-your-recording-rule', 'Define your recording rule'),
      helpContent: t(
        'alerting.query-step.recording-rule-help-content',
        'Pre-compute frequently needed or computationally expensive expressions and save their result as a new set of time series.'
      ),
      helpLink: 'https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-recording-rules/',
    },
    [RuleFormType.grafana]: {
      sectionTitle: t('alerting.query-step.define-query-and-alert-condition', 'Define query and alert condition'),
      helpLabel: t('alerting.query-step.define-query-and-alert-condition', 'Define query and alert condition'),
      helpContent: t(
        'alerting.query-step.alert-rule-help-content',
        'An alert rule consists of one or more queries and expressions that select the data you want to measure. Define queries and/or expressions and then choose one of them as the alert rule condition. This is the threshold that an alert rule must meet or exceed in order to fire. For more information on queries and expressions, see Query and transform data.'
      ),
      helpLink: 'https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/',
    },
    [RuleFormType.cloudAlerting]: {
      sectionTitle: t('alerting.query-step.define-query-and-alert-condition', 'Define query and alert condition'),
      helpLabel: t('alerting.query-step.define-query-and-alert-condition', 'Define query and alert condition'),
      helpContent: t(
        'alerting.query-step.alert-rule-help-content',
        'An alert rule consists of one or more queries and expressions that select the data you want to measure. Define queries and/or expressions and then choose one of them as the alert rule condition. This is the threshold that an alert rule must meet or exceed in order to fire. For more information on queries and expressions, see Query and transform data.'
      ),
      helpLink: 'https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/',
    },
  };
};

export const DESCRIPTIONS = getDescriptions();
