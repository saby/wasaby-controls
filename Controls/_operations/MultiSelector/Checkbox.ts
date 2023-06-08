/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_operations/MultiSelector/resources/CheckboxTemplate';
import { IMultiSelectableOptions } from 'Controls/interface';
import 'css!Controls/operations';

export interface IMultiSelectorCheckboxOptions
    extends IMultiSelectableOptions,
        IControlOptions {
    selectedKeysCount: number | null;
    isAllSelected: boolean;
}

type TCheckboxValue = boolean | null;

/**
 * Контрол, который отображает чекбокс, позволяющий произвести массовую отметку записей в списке.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/MultiSelector/Checkbox
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/operations/MultiSelectorCheckbox/Index
 */

export default class MultiSelectorCheckBox extends Control<IMultiSelectorCheckboxOptions> {
    protected _template: TemplateFunction = template;
    protected _checkboxValue: TCheckboxValue = false;

    protected _beforeMount(options: IMultiSelectorCheckboxOptions): void {
        this._checkboxValue = this._getCheckBoxState(options);
    }

    protected _beforeUpdate(newOptions: IMultiSelectorCheckboxOptions): void {
        if (
            this._options.selectedKeys !== newOptions.selectedKeys ||
            this._options.selectedKeysCount !== newOptions.selectedKeysCount ||
            this._options.isAllSelected !== newOptions.isAllSelected
        ) {
            this._checkboxValue = this._getCheckBoxState(newOptions);
        }
    }

    protected _onCheckBoxClick(): void {
        if (!this._options.readOnly) {
            const eventName =
                this._checkboxValue === false ? 'selectAll' : 'unselectAll';
            this._notify('selectedTypeChanged', [eventName], {
                bubbling: true,
            });
        }
    }

    private _getCheckBoxState(
        options: IMultiSelectorCheckboxOptions
    ): TCheckboxValue {
        const hasSelected = options.selectedKeys.length;
        const count = options.selectedKeysCount;
        let result;

        if (hasSelected && options.isAllSelected) {
            result = true;
        } else if (hasSelected && (count > 0 || count === null)) {
            result = null;
        } else {
            result = false;
        }

        return result;
    }
}
