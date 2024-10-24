import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/SkipItem/SkipItem';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { editing } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const READONLY_ITEMS_KEYS = [2, 3];

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceSkipItem: {
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

    protected _onBeforeBeginEdit(
        e: Event,
        options: {
            item: Model;
        }
    ) {
        const item: Model = options?.item;
        if (item && READONLY_ITEMS_KEYS.indexOf(item.getKey()) !== -1) {
            return editing.CANCEL;
        }
    }

    private _getItemTemplateClasses(item: Model): string {
        if (READONLY_ITEMS_KEYS.indexOf(item.getKey()) !== -1) {
            return 'controlsDemo__list__editInPlace__skipItem__notEditable';
        }
        return '';
    }
}
