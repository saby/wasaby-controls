import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/ActionMode';

/**
 * Демка для статьи https://wi.sbis.ru/docs/js/Controls/tile/View/options/actionMode/?v=22.1100
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
}
