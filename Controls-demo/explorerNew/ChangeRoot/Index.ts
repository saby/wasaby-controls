import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/ChangeRoot/ChangeRoot';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

const { getData } = Gadgets;

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Gadgets.getColumns();
    protected _itemPaddingSize: string = 's';
    private _root: number = null;

    protected _onToggleRoot(): void {
        const slice = this._options._dataOptionsValue.listData;
        if (this._root === null) {
            this._root = 1;
        } else {
            this._root = null;
        }
        slice.setRoot(this._root);
    }

    protected _changeRootAndAdditionalOptions(): void {
        this._onToggleRoot();
        this._itemPaddingSize = this._itemPaddingSize === 's' ? 'null' : 's';
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
                    viewMode: 'table',
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
});
