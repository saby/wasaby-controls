import { forwardRef } from 'react';
import { View } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlDemo_list-new_base';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__inline-block" style={{ marginRight: '20px' }}>
                <View storeId="Separator" rowSeparatorSize="s" />
            </div>

            <div className="controlsDemo__inline-block" style={{ marginRight: '20px' }}>
                <View storeId="Separator" rowSeparatorSize="l" />
            </div>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        Separator: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            },
        },
    };
};
