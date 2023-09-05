import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as tempalte from 'wml!Controls-demo/list_new/GradientOnHover/Cut/Index';
import { Memory } from 'Types/source';
import 'css!DemoStand/Controls-demo';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            id: 0,
        },
    ];
}

class Cut extends Control<IControlOptions> {
    protected _template: TemplateFunction = tempalte;
    protected _unaccentedBackground: boolean = false;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GradientOnHoverCut: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}

export default Cut;
