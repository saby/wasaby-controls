import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AfterEdit/AfterEdit';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getEditableCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _isShowAddButton: Boolean;

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

    protected _beforeMount(): void {
        this._isShowAddButton = true;
    }

    // eslint-disable-next-line
    protected _afterBeginEdit(
        e: SyntheticEvent<null>,
        { item }: { item: Model },
        isAdd: boolean
    ): void {
        this._isShowAddButton = false;
    }

    protected _afterEndEdit(
        e: SyntheticEvent<null>,
        { item }: { item: Model },
        isAdd: boolean
    ): void {
        this._isShowAddButton = true;
    }
}
