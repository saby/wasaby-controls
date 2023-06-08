/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import LookupTemplate = require('wml!Controls/_filterPanel/Editors/Lookup/LookupResolver');
import { ILookupEditorOptions } from './Lookup/_BaseLookup';
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 * @class Controls/_filterPanel/Editors/Lookup
 * @extends Controls/_filterPanel/Editors/Lookup/_BaseLookup
 * @implements Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor
 * @public
 */

export default class LookupEditor extends Control<ILookupEditorOptions> {
    readonly '[Controls/_filterPanel/Editors/Lookup]': boolean = true;
    protected _template: TemplateFunction = LookupTemplate;
}
