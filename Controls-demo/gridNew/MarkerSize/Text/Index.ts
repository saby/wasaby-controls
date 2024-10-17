import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Text } from '../DataHelpers/Text';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/gridNew/MarkerSize/Text/Text';

const { getData } = Text;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Text.getColumns();
    protected _padding: string[] = ['default', 's', 'l'];
    protected _markerSizes: string[] = ['content-xs'];

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MarkerSizeText: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
