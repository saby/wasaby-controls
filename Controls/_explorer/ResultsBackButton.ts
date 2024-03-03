/**
 * @kaizen_zone e8e36b1a-d1b2-42b9-a236-b49c3be0934f
 */
import type { GridResultsCell } from 'Controls/grid';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_explorer/ResultsBackButton';

interface IOptions extends IControlOptions {
    column: GridResultsCell;
}

/**
 * Компонент кнопки "Назад", отображаемой в строке итогов.
 * @private
 */
export default class ResultsBackButton extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _headingPathBackOptions: object;
    protected _needHeadingPathBack: boolean;

    protected _beforeMount(options: IOptions): void {
        this._updateState(options);
    }

    protected _beforeUpdate(newOptions: IOptions): void {
        this._updateState(newOptions);
    }

    private _updateState(options: IOptions): void {
        const { resultTemplateOptions } = options.column.getColumnConfig() as {
            resultTemplateOptions: any;
        };
        const items = resultTemplateOptions.items;

        this._needHeadingPathBack = !!resultTemplateOptions.items;
        if (this._needHeadingPathBack) {
            this._headingPathBackOptions = {
                ...resultTemplateOptions,
                counterCaption: items[items.length - 1].get('counterCaption'),
                backButtonClass: 'controls-BreadCrumbsPath__backButton__wrapper_inHeader',
            };
        }
    }
}
