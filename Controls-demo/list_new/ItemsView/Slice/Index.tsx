import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ItemsView } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
/**
 * Демо пример демонстрирует минимальную конфигурацию плоского списка без использования источника данных
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ItemsView storeId={'Base'} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Base: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    items: new RecordSet({
                        keyProperty: 'key',
                        rawData: getData(),
                    }),
                },
            },
        };
    },
});
