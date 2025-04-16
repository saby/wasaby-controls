import { forwardRef } from 'react';
import { AddButton } from 'Controls/list';
import { View, NodeFooterTemplate } from 'Controls/treeGrid';
import { FooterTemplate } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { HierarchicalMemory } from 'Types/source';
import { getActionsForContacts as getItemActions } from '../../list_new/DemoHelpers/ItemActionsCatalog';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!Controls-demo/treeGridNew/ColumnScroll/ColumnScroll';

function getData() {
    const data = Flat.getData();
    const country = 'Соединенные Штаты Америки';
    // eslint-disable-next-line
    data[2].country = `${country} ${country} ${country}`;
    return data;
}

const itemActions = getItemActions();
const columns = [
    {
        displayProperty: 'key',
        width: '60px',
    },
    {
        displayProperty: 'title',
        width: '200px',
    },
    {
        displayProperty: 'country',
        width: '150px',
    },
    {
        displayProperty: 'rating',
        width: '60px',
    },
    {
        displayProperty: 'hasChild',
        width: '120px',
    },
    {
        displayProperty: 'country',
        width: 'max-content',
    },
    {
        displayProperty: 'rating',
        width: '120px',
    },
];
const header = [
    {
        title: '#',
    },
    {
        title: 'Бренд',
    },
    {
        title: 'Страна производителя',
    },
    {
        title: 'Рейтинг',
    },
    {
        title: 'Есть товары?',
    },
    {
        title: 'Еще раз страна',
    },
    {
        title: 'Еще раз рейтинг',
    },
];

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container style={{ width: '600px', height: '400px' }}>
                <View
                    storeId="ColumnScroll"
                    header={header}
                    columns={columns}
                    columnScroll={true}
                    rowSeparatorSize="s"
                    itemActions={itemActions}
                    stickyColumnsCount={2}
                    nodeFooterTemplate={(nodeFooterProps) => {
                        return (
                            <NodeFooterTemplate {...nodeFooterProps}>
                                <AddButton caption="Добавить товар" />
                            </NodeFooterTemplate>
                        );
                    }}
                    footerTemplate={(footerTemplateProps) => {
                        return (
                            <FooterTemplate {...footerTemplateProps}>
                                <div className="controlsDemo__treeGrid__footer__content">
                                    <span>Подвал дерева</span>
                                    <div className="controlsDemo__treeGrid__footer__locator"></div>
                                </div>
                            </FooterTemplate>
                        );
                    }}
                ></View>
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnScroll: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new HierarchicalMemory({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                expandedItems: [1, 11],
            },
        },
    };
};
