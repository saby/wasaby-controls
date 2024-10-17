import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemClick/WithEditing/WithEditing';
import { Memory } from 'Types/source';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];
    protected _hasMultiSelect: boolean = false;
    protected _textsInfo: string[] = [];

    protected _beforeMount(): void {
        this._itemActions = getItemActions();
    }

    protected _onItemClick(): void {
        this._textsInfo.push('itemClick()');
    }

    protected _onItemActivate(): void {
        this._textsInfo.push('itemActivate()');
    }

    protected _clear(): void {
        this._textsInfo = [];
    }

    _onHasMultiSelectChanged(e: Event, value: boolean) {
        this._hasMultiSelect = value;
        const slice = this._options._dataOptionsValue.ItemClickWithEditing;
        slice.setState({
            multiSelectVisibility: this._hasMultiSelect ? 'visible' : 'hidden'
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemClickWithEditing: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'hidden'
                },
            },
        };
    }
});
