import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EditingOnMounting/EditingOnMounting';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextValue } from 'Controls/context';
import { IItemAction } from 'Controls/itemActions';
import { IEditingConfig } from 'Controls/display';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

function getData() {
    const data = getFewCategories().slice(0, 1);
    data[0].key = 1;
    return data;
}

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();
    protected _editingConfig: IEditingConfig;

    protected _beforeMount(props: IProps): void {
        // Берём из слайса список записей и первую ставим на редактирование
        const items = props._dataOptionsValue.listData.items;
        this._editingConfig = {
            toolbarVisibility: true,
            item: items.at(0),
            editOnClick: true,
        };
    }
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/.
// Обёртка необходима, чтобы в самой демке иметь доступ к предзагруженным данным.
export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
    },
});
