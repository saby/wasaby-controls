import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ShowEditArrow/ShowEditArrow';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IColumn } from 'Controls/grid';
import { ChangeSourceData } from 'Controls-demo/gridNew/DemoHelpers/Data/ChangeSource';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '50px',
        },
        {
            displayProperty: 'load',
            width: '200px',
        },
    ];
    protected _clickedKey: string;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: ChangeSourceData.getData1(),
        });
    }

    protected _editArrowClick(e: SyntheticEvent, model: Model): void {
        this._clickedKey = model.getKey();
    }
}
