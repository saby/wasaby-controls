import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Reload/ByCursor/ByCursor';
import { slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { INavigationOptionValue, INavigationPositionSourceConfig } from 'Controls/interface';
import PositionSourceMock from './PositionSourceMock';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getNavigation(position: number): INavigationOptionValue<INavigationPositionSourceConfig> {
    return {
        source: 'position',
        view: 'infinity',
        sourceConfig: {
            field: 'key',
            position,
            direction: 'bothways',
            limit: 20,
        },
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;

    protected _changePosition(_: Event, correction: number): void {
        const slice = this._options._dataOptionsValue.listData;
        let navigation: INavigationOptionValue<INavigationPositionSourceConfig>;
        if (!correction) {
            navigation = getNavigation(60);
        } else {
            const newPosition = (slice.navigation.sourceConfig.position as number) + correction;
            navigation = getNavigation(newPosition);
        }
        slice.setState({
            navigation,
        });
    }

    protected _slowDownSource(): void {
        const source = this._options._dataOptionsValue.listData.source;
        slowDownSource(source, 500);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({
                        keyProperty: 'key',
                    }),
                    navigation: getNavigation(0),
                },
            },
        };
    },
});
