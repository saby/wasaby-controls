import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/GroupedEmptySource/GroupedEmptySource';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { groupConstants as constView } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _fakeItemId: number;
    private _editingConfig: object = {
        editOnClick: false,
        sequentialEditing: true,
        addPosition: 'top',
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceGroupedEmptySource: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._fakeItemId = 0;
    }

    protected _beginAdd(): void {
        const item = new Model({
            keyProperty: 'key',
            rawData: {
                key: ++this._fakeItemId,
                title: '',
                brand: 'asd',
            },
        });
        this._children.list.beginAdd({ item });
    }

    private _groupingKeyCallback(item: Model): string {
        const groupId = item.get('brand');
        return groupId === 'apple' ? constView.hiddenGroup : groupId;
    }
}
