import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/TileWidth/TileWidth';

function getData() {
    return [
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
}

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/view/width/#width
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
