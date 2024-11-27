import { TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import Baseindex from '../BaseIndex';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemPadding/Custom/Custom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

export default class extends Baseindex {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemPaddingCustom0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
