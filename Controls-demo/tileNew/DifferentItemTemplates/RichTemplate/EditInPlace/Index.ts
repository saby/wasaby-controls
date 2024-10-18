import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/EditInPlace/EditInPlace';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            id: 1,
            parent: null,
            type: null,
            title: 'Молоко "Кружева" ультрапастеризованное 1 л',
            description: 'Элемент с редактированием по месту',
            imageProportion: '1:1',
            titleLines: 2,
            imagePosition: 'top',
            imageViewMode: 'rectangle',
            'parent@': null,
            imageHeight: 's',
            image: Images.MEDVED,
            isShadow: true,
            price: 250,
            weight: 1,
        },
        {
            id: 2,
            parent: null,
            type: null,
            title: 'Мост',
            description: 'Можно задать шаблон редактирования и для футера',
            imageProportion: '1:1',
            titleLines: 2,
            imagePosition: 'top',
            imageViewMode: 'rectangle',
            'parent@': null,
            imageHeight: 's',
            image: Images.BRIDGE,
            isShadow: true,
            price: 250,
            weight: 1000,
        },
        {
            id: 3,
            parent: null,
            type: null,
            title: 'Мост',
            description: 'А еще есть возможность сделать тулбар для изменения изображений',
            imageProportion: '1:1',
            titleLines: 2,
            imagePosition: 'top',
            imageViewMode: 'rectangle',
            'parent@': null,
            imageHeight: 's',
            image: Images.BRIDGE,
            isShadow: true,
            price: 550,
            weight: 1500,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._itemActions = Gadgets.getActions();
    }

    protected _removeImage(e: SyntheticEvent, item: Model): void {
        item.set('image', undefined);
    }

    protected _changeImage(e: SyntheticEvent, item: Model): void {
        if (item.get('image') === Images.BRIDGE) {
            item.set('image', Images.MEDVED);
        } else {
            item.set('image', Images.BRIDGE);
        }
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
