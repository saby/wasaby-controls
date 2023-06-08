import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/AdditionalPaneltemplate/Template';
import { HierarchicalMemory } from 'Types/source';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/interface';

const DATA = [
    {
        id: 0,
        parent: null,
        type: null,
        title: 'Мост',
        image: Images.BRIDGE,
        'parent@': null,
        description: 'Мост',
        imageProportion: '1:1',
        imageViewMode: 'circle',
        imagePosition: 'top',
        gradientType: 'dark',
        isDocument: true,
        width: 300,
        isShadow: true,
        additionalPanelPosition: 'topRight',
    },
    {
        id: 1,
        parent: null,
        type: null,
        title: 'Медведики',
        description: 'Элемент с описанием',
        imageProportion: '16:9',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'rectangle',
        'parent@': null,
        image: Images.MEDVED,
        isShadow: true,
        additionalPanelPosition: 'bottomLeft',
    },
    {
        id: 2,
        parent: null,
        type: null,
        title: 'Мост',
        description: 'Элемент с описанием',
        imageProportion: '16:9',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'rectangle',
        'parent@': null,
        image: Images.BRIDGE,
        isShadow: true,
        additionalPanelPosition: 'topLeft',
    },
    {
        id: 3,
        parent: null,
        type: null,
        title: 'Медведики',
        description: 'Элемент с описанием',
        imageProportion: '1:1',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'rectangle',
        'parent@': null,
        image: Images.MEDVED,
        isShadow: true,
        additionalPanelPosition: 'bottomRight',
    },
    {
        id: 4,
        parent: null,
        type: null,
        title: 'Нет медведиков',
        description:
            'Элемент с описанием, но без изображения. Тут надо посмотреть, не накладывается ли иконка на заголовок. Заголовок должен отодвинуться',
        imageProportion: '1:1',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'none',
        'parent@': null,
        isShadow: true,
        additionalPanelPosition: 'topLeft',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: DATA,
        });
    }

    protected _setLove(e: Event, item: Model, value: boolean): void {
        item.set('love', value);
    }
}
