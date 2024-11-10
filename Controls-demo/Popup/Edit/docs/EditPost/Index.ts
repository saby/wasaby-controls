import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import template = require('wml!Controls-demo/Popup/Edit/docs/EditPost/Template');
import { data, gridColumns, gridHeader } from 'Controls-demo/Popup/Edit/docs/resources/data';
import 'wml!Controls-demo/List/Grid/DemoItem';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return data;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _gridColumns: object[];
    protected _gridHeader: object[];
    protected _beforeMount(): void {
        this._gridColumns = gridColumns;
        this._gridHeader = gridHeader;
    }

    protected _getOpenConfig(): object {
        return {
            opener: this,
            templateOptions: {
                type: 'Edit',
                source: this._options._dataOptionsValue.PopupEditPost.source,
            },
        };
    }

    protected _clickHandler(event: Event, record: Model): void {
        this._children.EditOpener.open({ record }, this._getOpenConfig());
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            PopupEditPost: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    },
});
