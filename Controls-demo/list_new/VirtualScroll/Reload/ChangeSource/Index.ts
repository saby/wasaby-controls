import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Reload/ChangeSource/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import PositionSourceMock from './PositionSourceMock';

let hasMoreData = true;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;

    protected _changeSource(): void {
        hasMoreData = !hasMoreData;
        const slice = this._options._dataOptionsValue.VirtualScrollReloadChangeSource;
        slice.setState({
            source: new PositionSourceMock({
                keyProperty: 'key',
                hasMoreData,
            }),
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollReloadChangeSource: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({
                        keyProperty: 'key',
                        hasMoreData,
                    }),
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'bothways',
                            limit: 20,
                        },
                    },
                },
            },
        };
    },
});
