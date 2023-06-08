import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/BeginEdit/BeginEdit';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getEditableCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { editing as constEditing } from 'Controls/list';

const TIMEOUT1000 = 1000;
const TIMEOUT3000 = 3000;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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

    // eslint-disable-next-line
    protected _beforeBeginEdit(
        e: SyntheticEvent<null>,
        { item }: { item: Model },
        isAdd: boolean
    ): Promise<any> | string {
        if (item.get('key') === 1) {
            return constEditing.CANCEL;
        }
        // eslint-disable-next-line
        if (item.get('key') === 2) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ item });
                }, TIMEOUT1000);
            });
        }
        // eslint-disable-next-line
        if (item.get('key') === 3) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ item });
                }, TIMEOUT3000);
            });
        }
        // eslint-disable-next-line
        if (item.get('key') === 4) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(constEditing.CANCEL);
                }, TIMEOUT1000);
            });
        }
    }
}
