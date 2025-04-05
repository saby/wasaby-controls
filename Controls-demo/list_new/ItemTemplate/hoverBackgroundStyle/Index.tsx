import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getColorsData as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

const itemActions = getItemActions().slice(1);

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__maxWidth200 controlDemo_list-new_base';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="ItemTemplatehoverBackgroundStyle"
                itemActions={itemActions}
                itemTemplate={itemTemplate}
            ></View>
        </div>
    );
});

export default Component;

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            hoverBackgroundStyle={itemTemplateProps.item.contents.get('hoverBackgroundStyle')}
            contentTemplate={
                <div className="Controls-demo_itemTemplate_hoverBackGroundStyle-content">
                    <div>{itemTemplateProps.item.contents.get('hoverBackgroundStyle')}</div>
                </div>
            }
        ></ItemTemplate>
    );
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplatehoverBackgroundStyle: {
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
