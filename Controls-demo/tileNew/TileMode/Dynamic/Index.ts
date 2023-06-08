import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/TileMode/Dynamic/Dynamic';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { Getter } from 'File/ResourceGetter/fileSystem';
import { object } from 'Types/util';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

const WIDE_FOLDER = 400;
const NARROW_FOLDER = 300;

function getData() {
    return Gadgets.getPreviewItems();
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _currentItems: object[] = null;
    protected _folderWidth: number = WIDE_FOLDER;

    protected _beforeMount(): void {
        this._itemActions = Gadgets.getPreviewActions();
    }

    protected _imageUrlResolver(width: number, height: number, url: string): string {
        const [name, extension] = url.split('.');
        return `${name}${width}${height}.${extension}`;
    }

    _addItemFromFile(file: File): void {
        const reader = new FileReader();
        const slice = this._options._dataOptionsValue.listData;
        const newItems = slice.items.getRawData();
        const newItem = object.clone(newItems[newItems.length - 1]);
        newItem.id = newItems.length + 1;
        reader.onload = (event): void => {
            newItem.image = event.target.result;
            const image = new Image();
            image.onload = (loadEvent) => {
                newItem.imageHeight = loadEvent.currentTarget.height;
                newItem.imageWidth = loadEvent.currentTarget.width;
                newItems.push(newItem);
                this._currentItems = newItems;
                slice.setState({
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: newItems,
                    })
                });
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    protected _getImage(): void {
        const fileSystem = new Getter({
            extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'ico', 'svg'],
        });
        fileSystem.getFiles().then((files) => {
            this._addItemFromFile(files[0].getData());
        });
    }

    protected _changeFolderWidth(): void {
        this._folderWidth = this._folderWidth === WIDE_FOLDER ? NARROW_FOLDER : WIDE_FOLDER;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
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
                },
            },
        };
    }
});
