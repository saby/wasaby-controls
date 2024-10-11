import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/TileScalingMode/Outside/template';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getPreviewItems();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _itemActions: any[] = null;

    protected _beforeMount(): void {
        this._itemActions = Gadgets.getPreviewActions();
    }

    protected _imageUrlResolver(width: number, height: number, url: string): string {
        const [name, extension] = url.split('.');
        return `${name}${width}${height}.${extension}`;
    }

    static _styles: string[] = ['Controls-demo/tileNew/TileScalingMode/style'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TileScalingModeOutside: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
