/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import _BaseLookup from './Lookup/_BaseLookup';
import LookupSelectorTemplate from './Lookup/LookupSelectorTemplate';

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 * @class Controls/_filterPanelEditors/LookupSelector
 * @mixes Controls/_filterPanelEditors/Lookup/interface/ILookupEditor
 * @private
 */

export default React.forwardRef((props, ref) => {
    return (
        <_BaseLookup forwardedRef={ref} {...props}>
            <LookupSelectorTemplate />
        </_BaseLookup>
    );
});
