import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { TBreadcrumbsVisibility, View as Explorer } from 'Controls/explorer';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import * as template from 'wml!Controls-demo/explorerNew/BreadCrumbsInHeader/Default/Default';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _children: {
        explorer: Explorer;
    };
    protected _itemActions: IItemAction[];
    protected _header: IHeaderCell[] = Gadgets.getHeader();
    protected _columns: IColumn[] = Gadgets.getGridColumns();

    protected _breadcrumbsVisibility: TBreadcrumbsVisibility = 'visible';
    protected _breadcrumbsVisibilitySource: Memory = new Memory({
        keyProperty: 'id',
        data: [{ id: 'hidden' }, { id: 'visible' }, { id: 'onlyBackButton' }],
    });

    private _needResults: boolean = true;

    protected get _resultsVisible(): boolean {
        return this._needResults;
    }

    protected set _resultsVisible(value: boolean) {
        this._needResults = value;
        this.props._dataOptionsValue.BreadCrumbsInHeaderDefault.setNeedResults(value);
    }

    private _needHeader: boolean = true;

    protected get _headerVisible(): boolean {
        return this._needHeader;
    }

    protected set _headerVisible(value: boolean) {
        this._needHeader = value;

        if (value) {
            this._header = Gadgets.getHeader();
        } else {
            this._header = [];
        }
    }

    protected _beforeMount(): void {
        this._columns[0].width = '290px';
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: 2,
            },
            {
                id: 2,
                icon: 'icon-EmptyMessage',
                title: 'message',
                showType: 2,
            },
        ];
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BreadCrumbsInHeaderDefault: {
                dataFactoryName:
                    'Controls-demo/explorerNew/BreadCrumbsInHeader/Default/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getData(),
                    }),
                    root: 1,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
