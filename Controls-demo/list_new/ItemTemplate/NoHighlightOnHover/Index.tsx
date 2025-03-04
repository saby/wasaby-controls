import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__list_new-itemTepmlate-NoHighlightOnHover';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateNoHighlightOnHover" itemTemplate={itemTemplate} />
        </div>
    );
});

export default Component;

function itemTemplate(itemTemplateProps) {
    return <ItemTemplate {...itemTemplateProps} highlightOnHover={false} />;
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateNoHighlightOnHover: {
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
