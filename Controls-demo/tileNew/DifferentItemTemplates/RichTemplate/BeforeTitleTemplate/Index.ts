import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/BeforeTitleTemplate/Template';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';

import { HierarchicalMemory } from 'Types/source';
import 'css!Controls/CommonClasses';

const DATA = [
    {
        id: 1,
        parent: null,
        type: null,
        title: 'Заголовок без иконок',
        description: '',
        imageProportion: '4:3',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'rectangle',
        'parent@': null,
        imageHeight: 's',
        image: explorerImages[8],
        isShadow: true,
    },
    {
        id: 2,
        parent: null,
        type: null,
        imageProportion: '4:3',
        title: 'Заголовок с иконкой короны в начале строки',
        description: '',
        titleLines: 1,
        'parent@': null,
        imagePosition: 'left',
        imageViewMode: 'ellipse',
        imageHeight: 'm',
        image: explorerImages[8],
        isShadow: true,
        icon: 'icon-CrownNull',
    },
    {
        id: 3,
        parent: null,
        type: null,
        title: 'Звезда',
        imageProportion: '4:3',
        description: '',
        titleLines: 1,
        imageViewMode: 'ellipse',
        imagePosition: 'right',
        'parent@': null,
        imageHeight: 'l',
        image: explorerImages[8],
        isShadow: true,
        icon: 'icon-Unfavorite',
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
