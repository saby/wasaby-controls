/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/Editors/EditorChooser/EditorChooser';

/**
 * Компонент-обертка для редакторов выбора из справочника.
 * @private
 */
export default class EditorChooser extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
