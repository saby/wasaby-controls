import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IRoundBorder } from 'Controls/interface';
import { TBorderStyle } from 'Controls/display';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Border/Template';

import { DATA } from 'Controls-demo/tileNew/DataHelpers/RichTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return DATA;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    // Скругление углов
    protected _roundBorder: IRoundBorder = {
        bl: 'm',
        br: 'm',
        tl: 'm',
        tr: 'm',
    };
    // Текущий цвет рамки
    protected _borderStyle: TBorderStyle;
    // Варианты цвета рамки
    protected _borderStyleVariants: TBorderStyle[] = ['default', 'danger'];

    protected _setBorderStyle(e: SyntheticEvent, value: TBorderStyle): void {
        this._borderStyle = value;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
