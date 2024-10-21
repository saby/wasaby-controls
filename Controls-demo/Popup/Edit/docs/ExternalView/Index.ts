import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import template = require('wml!Controls-demo/Popup/Edit/docs/ExternalView/Template');
import { data } from 'Controls-demo/Popup/Edit/docs/resources/data';
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
    protected _viewSource: Memory;
    protected _record: Model;

    protected _beforeMount(props: IProps): void {
        this._viewSource = props._dataOptionsValue.PopupEditExternal.source;
        // Данный код выполнится на роутинге для получения записи с которой будет работать.
        this._viewSource.read('0').then((record) => {
            return (this._record = record);
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            PopupEditExternal: {
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
