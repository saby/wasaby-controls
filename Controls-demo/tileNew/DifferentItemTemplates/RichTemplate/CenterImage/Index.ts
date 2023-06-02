import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/CenterImage/Template';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { HierarchicalMemory } from 'Types/source';
import 'css!Controls/CommonClasses';

const DATA = [
    {
        id: 1,
        parent: null,
        type: null,
        title: 'Заголовок с длинным названием, которое обрезается на второй строке',
        description: 'Иконки после текста',
        imageProportion: '4:3',
        titleLines: 2,
        gradientColor: '#efefef',
        'parent@': null,
        imageHeight: 's',
        image: explorerImages[10],
        isShadow: true,
        signatures: ['secondary'],
    },
    {
        id: 2,
        parent: null,
        type: null,
        imageProportion: '4:3',
        title: 'Заголовок со средним названием на полторы строки',
        description: '',
        titleLines: 2,
        'parent@': null,
        imageHeight: 'm',
        image: explorerImages[11],
        isShadow: true,
        signatures: ['secondary', 'primary'],
    },
    {
        id: 3,
        parent: null,
        type: null,
        title: 'Короткий заголовок',
        imageProportion: '4:3',
        description:
            'На плитке можно разместить прикладной контент в строке заголовка',
        titleLines: 2,
        'parent@': null,
        imageHeight: 'l',
        image: explorerImages[12],
        isShadow: true,
        signatures: ['secondary', 'primary'],
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: DATA,
        });
    }
}
