import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';

import * as Template from 'wml!Controls-demo/tileNew/TileWidth/TileWidth';

const DATA = [
    {
        key: 1,
        parent: null,
        type: null,
        title: 'Шаблон 5.2 с изображением и заголовком на нем',
        gradientColor: '#E0E0E3',
        description: 'Проверяем работу tileHeight. Заголовок красный.',
        imageProportion: '1:1',
        titleLines: 3,
        imagePosition: 'top',
        'parent@': null,
        imageHeight: 's',
        image: explorerImages[8],
        isShadow: true,
    },
    {
        key: 2,
        parent: null,
        type: null,
        title: 'Шаблон 5.2 с изображением и заголовком на нем',
        gradientColor: '#E0E0E3',
        titleColorStyle: 'danger',
        description: 'Проверяем работу tileHeight. Заголовок красный.',
        imageProportion: '1:1',
        titleLines: 3,
        imagePosition: 'top',
        'parent@': null,
        imageHeight: 's',
        image: explorerImages[8],
        isShadow: true,
    },
];

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/view/width/#width
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: DATA,
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
