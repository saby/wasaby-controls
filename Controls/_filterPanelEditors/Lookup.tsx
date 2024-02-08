/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { ILookupEditorOptions } from './Lookup/_BaseLookup';
import LookupInput from 'Controls/_filterPanelEditors/LookupInput';
import LookupSelector from './LookupSelector';
import 'css!Controls/filterPanelEditors';

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчки по настроке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчки по настроке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/filterPanelEditors:Lookup
 * @extends Controls/lookup:Selector
 * @mixes Controls/_filterPanelEditors/Lookup/interface/ILookupEditor
 * @mixes Controls/filterPanelEditors:IFrequentItem
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/SelectorMode/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Base/Index
 * @public
 */

export default React.forwardRef(function LookupEditor(
    props: ILookupEditorOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    if (props.searchParam && (props.suggestTemplate || props.suggestItemTemplate)) {
        return <LookupInput {...props} forwardedRef={ref} />;
    } else {
        return <LookupSelector {...props} forwardedRef={ref} />;
    }
});
