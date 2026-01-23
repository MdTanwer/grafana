import { useCallback } from 'react';

import { SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { RadioButtonGroup } from '@grafana/ui';

import { trackRulesListViewChange } from '../../../Analytics';
import { shouldUseAlertingListViewV2 } from '../../../featureToggles';
import { useRulesFilter } from '../../../hooks/useFilteredRules';
import { useURLSearchParams } from '../../../hooks/useURLSearchParams';

export type SupportedView = 'list' | 'grouped';

type LegacySupportedView = 'list' | 'grouped' | 'state';

interface RulesViewModeSelectorV2Props {
  viewMode?: SupportedView;
  onViewModeChange?: (viewMode: SupportedView) => void;
}

/**
 * Selecting a view mode is no longer a simple toggle relying on the URL query params.
 * We now need to check if the current filters are compatible with the grouped view.
 * If they are, we show the grouped view by default.
 * If they are not, we show the list view.
 * Use the complementary {@link useListViewMode} hook to get the current view mode and a handler for changing it.
 */
function RulesViewModeSelectorV2({ viewMode, onViewModeChange }: RulesViewModeSelectorV2Props) {
  // Define options inside component to use t() function
  const ViewOptions: Array<SelectableValue<SupportedView>> = [
    {
      icon: 'folder',
      value: 'grouped',
      label: t('alerting.rules-view.grouped-view-label', 'Grouped'),
      ariaLabel: t('alerting.rules-view.grouped-view-aria-label', 'View rules grouped by namespace and group'),
    },
    {
      icon: 'list-ul',
      value: 'list',
      label: t('alerting.rules-view.list-view-label', 'List'),
      ariaLabel: t('alerting.rules-view.list-view-aria-label', 'View rules as a flat list'),
    },
  ];

  return (
    <RadioButtonGroup
      options={ViewOptions}
      value={viewMode}
      onChange={onViewModeChange}
      aria-label={t('alerting.rules-view.selector-aria-label', 'Select rules view mode')}
    />
  );
}

export function useListViewMode() {
  const [queryParams, updateQueryParams] = useURLSearchParams();
  const { activeFilters } = useRulesFilter();

  const queryStringView: SupportedView = queryParams.get('view') === 'list' ? 'list' : 'grouped';

  const areFiltersGroupedViewCompatible = activeFilters.every(
    (filter) => filter === 'groupName' || filter === 'namespace'
  );
  const showListView = areFiltersGroupedViewCompatible === false || queryStringView === 'list';

  const handleViewChange = useCallback(
    (view: SupportedView) => {
      if (view === 'grouped') {
        // When switching to grouped view, preserve filters only if they are grouped-view compatible
        if (areFiltersGroupedViewCompatible) {
          // Only remove view parameter, keep search (preserve group/namespace filters)
          updateQueryParams({ view: undefined });
        } else {
          // Clear both view and search (clear all filters)
          updateQueryParams({ view: undefined, search: undefined });
        }
      } else {
        updateQueryParams({ view });
      }
      trackRulesListViewChange({ view });
    },
    [updateQueryParams, areFiltersGroupedViewCompatible]
  );

  const viewMode: SupportedView = showListView ? 'list' : 'grouped';

  return {
    viewMode,
    handleViewChange,
  };
}

function RulesViewModeSelectorV1() {
  const [queryParams, updateQueryParams] = useURLSearchParams();
  const viewParam = queryParams.get('view');

  const currentView = viewParamToLegacyView(viewParam);

  // Define options inside component to use t() function
  const LegacyViewOptions: Array<SelectableValue<LegacySupportedView>> = [
    {
      label: t('alerting.rules-view.grouped-view-label', 'Grouped'),
      value: 'grouped',
      ariaLabel: t('alerting.rules-view.grouped-view-aria-label', 'View rules grouped by namespace and group'),
    },
    {
      label: t('alerting.rules-view.list-view-label', 'List'),
      value: 'list',
      ariaLabel: t('alerting.rules-view.list-view-aria-label', 'View rules as a flat list'),
    },
    {
      label: t('alerting.rules-view.state-view-label', 'State'),
      value: 'state',
      ariaLabel: t('alerting.rules-view.state-view-aria-label', 'View rules grouped by state'),
    },
  ];

  const handleViewChange = (view: LegacySupportedView) => {
    updateQueryParams({ view });
  };

  return (
    <RadioButtonGroup
      options={LegacyViewOptions}
      value={currentView}
      onChange={handleViewChange}
      aria-label={t('alerting.rules-view.selector-aria-label', 'Select rules view mode')}
    />
  );
}

function viewParamToLegacyView(viewParam: string | null): LegacySupportedView {
  if (viewParam === 'list') {
    return 'list';
  }

  if (viewParam === 'state') {
    return 'state';
  }

  return 'grouped';
}

interface RulesViewModeSelectorProps {
  viewMode?: SupportedView;
  onViewModeChange?: (viewMode: SupportedView) => void;
}

export function RulesViewModeSelector({ viewMode, onViewModeChange }: RulesViewModeSelectorProps) {
  if (shouldUseAlertingListViewV2()) {
    return <RulesViewModeSelectorV2 viewMode={viewMode} onViewModeChange={onViewModeChange} />;
  }

  return <RulesViewModeSelectorV1 />;
}
