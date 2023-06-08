/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { TemplateFunction } from 'UI/Base';
import BaseLookupEditor from 'Controls/_filterPanel/Editors/Lookup/_BaseLookup';
import LookupTemplate = require('wml!Controls/_filterPanel/Editors/Lookup/LookupSelector');
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 * @class Controls/_filterPanel/Editors/LookupSelector
 * @extends UI/Base:Control
 * @mixes Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor
 * @private
 */

export default class LookupEditor extends BaseLookupEditor {
    readonly '[Controls/_filterPanel/Editors/Lookup]': boolean = true;
    protected _template: TemplateFunction = LookupTemplate;
}
