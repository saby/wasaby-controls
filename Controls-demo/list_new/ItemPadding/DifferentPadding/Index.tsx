import { forwardRef } from 'react';
import { View } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

const ITEM_PADDING = { left: 'xxl', right: 'null' };

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemPaddingDifferentPadding0" itemPadding={ITEM_PADDING} />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemPaddingDifferentPadding0: {
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
