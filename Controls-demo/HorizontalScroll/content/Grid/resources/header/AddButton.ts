import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/content/Grid/resources/header/AddButton';
import { TActionClickCallback, IReturnColumn } from './../header';

interface IAddButtonOptions extends IControlOptions {
    onClickCallback: TActionClickCallback;
    column: IReturnColumn;
    index: number;
}

export default class AddButton extends Control<IAddButtonOptions> {
    protected _template: TemplateFunction = Template;

    protected _onAddControlsClick(): void {
        this._options.onClickCallback(
            'controls',
            this._options.column,
            this._options.index
        );
    }
}
