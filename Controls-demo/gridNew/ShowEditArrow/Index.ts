import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ShowEditArrow/ShowEditArrow';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IColumn } from 'Controls/grid';
import { ChangeSourceData } from 'Controls-demo/gridNew/DemoHelpers/Data/ChangeSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return ChangeSourceData.getData1();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
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

    protected _editArrowClick(e: SyntheticEvent, model: Model): void {
        this._clickedKey = model.getKey();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ShowEditArrow: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
