/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import _BaseLookup from './Lookup/_BaseLookup';
import LookupInputTemplate from './Lookup/LookupInputTemplate';
import LookupSelectorTemplate from './Lookup/LookupSelectorTemplate';

/**
 * Контрол используют в качестве редактора поле ввода с выбором значений из справочника.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчки по настроке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчки по настроке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/filterPanel:LookupInputEditor
 * @extends Controls/lookup:Input
 * @mixes Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor
 * @mixes Controls/filterPanel:IFrequentItem
 * @demo Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index
 * @public
 */
export default React.forwardRef((props, ref) => {
    return (
        <_BaseLookup forwardedRef={ref} {...props}>
            {props.editorsViewMode === 'cloud' && props.filterViewMode === 'default' ? (
                <LookupSelectorTemplate />
            ) : (
                <LookupInputTemplate />
            )}
        </_BaseLookup>
    );
});
