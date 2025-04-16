import { forwardRef } from 'react';
import { View } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo__flexRow';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controlsDemo__mr2 controlsDemo-ver-padding-null">
                <div className="controls-text-label">Отступы соответствующие размеру null</div>
                <View
                    storeId="ItemPaddingVerticalPadding"
                    itemPadding={{ top: 'xxl', bottom: 'null' }}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo__mr2 controlsDemo-ver-padding-m">
                <div className="controls-text-label">Отступы соответствующие размеру S</div>
                <View
                    storeId="ItemPaddingVerticalPadding3"
                    itemPadding={{ top: 'S', bottom: 'S' }}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo__mr2 controlsDemo-ver-padding-l">
                <div className="controls-text-label">
                    Отступы соответствующие размеру L (По умолчанию)
                </div>
                <View storeId="ItemPaddingVerticalPadding3" />
            </div>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemPaddingVerticalPadding: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            },
        },
        ItemPaddingVerticalPadding3: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                multiSelectVisibility: 'visible',
            },
        },
    };
};
