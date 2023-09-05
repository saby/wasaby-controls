import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';

interface IBaseIndexOptions extends IControlOptions {
    showTitle: boolean;
}

export default class extends Control<IBaseIndexOptions> {
    protected _template: TemplateFunction;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _showTitle: boolean;

    protected _beforeMount(
        options?: IBaseIndexOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._showTitle = !options || options.showTitle !== false;
    }
}
