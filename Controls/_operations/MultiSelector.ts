/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_operations/MultiSelector/MultiSelector');
import { IMultiSelectableOptions } from 'Controls/interface';
import 'css!Controls/operations';

export interface IMultiSelectorOptions
    extends IMultiSelectableOptions,
        IControlOptions {
    isAllSelected: boolean;
    selectedKeysCount: number | null;
}
/**
 * Контрол, отображающий чекбокс для массовой отметки записей и выпадающий список, позволяющий отмечать все записи, инвертировать, снимать с них отметку.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/897d41142ed56c25fcf1009263d06508aec93c32/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/MultiSelector
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/operations/MultiSelector/Index
 */
class MultiSelector extends Control<IMultiSelectorOptions> {
    protected _template: TemplateFunction = template;
}

export default MultiSelector;
