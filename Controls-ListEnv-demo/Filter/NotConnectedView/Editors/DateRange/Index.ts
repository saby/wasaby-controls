import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/Editors/DateRange/Index';
import { IFilterItem } from 'Controls/filter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sourceLeft: IFilterItem[] = [];
    protected _sourceRight: IFilterItem[] = [];

    protected _beforeMount(): void {
        this._sourceLeft = this._getFilterSource('left');
        this._sourceRight = this._getFilterSource('right');
    }

    private _getFilterSource(alignment: string): IFilterItem[] {
        return [
            {
                name: 'date',
                group: 'firstGroup',
                value: null,
                type: 'dateRange',
                itemTemplate:
                    'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/DateRange',
                editorOptions: {
                    emptyCaption: 'Весь период',
                    editorMode: 'Selector',
                    chooseHalfyears: true,
                    chooseYears: true,
                    resetStartValue: null,
                    resetEndValue: null,
                    nextArrowVisible: true,
                    prevArrowVisible: true,
                    nextArrowAlignment: alignment,
                    prevArrowAlignment: alignment,
                },
                viewMode: 'basic',
            },
        ];
    }
}
