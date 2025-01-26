import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/Grouped/Grouped';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getEditableGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IEditingConfig } from 'Controls/display';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _editingConfig: IEditingConfig = {
        editOnClick: true,
        sequentialEditing: true,
        addPosition: 'top',
    };
    protected _addPosition: string = 'top';
    private _fakeItemId: number;
    private _activeGroup: string = 'Xiaomi';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceGrouped: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'key',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _beforeMount(): void {
        const data = getData();
        this._fakeItemId = data.length;
    }

    protected _setPosition(e: Event, position: 'top' | 'bottom'): void {
        this._addPosition = position;
        this._editingConfig.addPosition = position;
    }

    protected _onBeforeBeginEdit(
        e: SyntheticEvent<null>,
        options: { item?: Model },
        isAdd: boolean
    ): Promise<{ item: Model }> | void {
        if (!isAdd) {
            this._activeGroup = options.item.get('brand');
            return;
        }
    }

    protected _beginAdd(): void {
        const item = new Model({
            keyProperty: 'key',
            rawData: {
                key: ++this._fakeItemId,
                title: '',
                brand: this._activeGroup,
            },
        });
        this._children.list.beginAdd({ item });
    }
}
