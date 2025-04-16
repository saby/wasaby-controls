import { useCallback, forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 1000;

function getData() {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

const RenderDemo = forwardRef(function (props, ref) {
    const dragStart = useCallback((items: string[]): ItemsEntity => {
        return new ItemsEntity({ items });
    }, []);
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height400 controlsDemo__minWidth600 controlsDemo__maxWidth800">
                <View
                    storeId="ColumnsViewDefault"
                    name="listView2"
                    itemsDragNDrop={true}
                    onCustomdragStart={dragStart}
                    itemTemplate={itemTemplate}
                />
            </Container>
        </div>
    );
});

export default RenderDemo;

function itemTemplate(itemTemplateProps) {
    return <ItemTemplate {...itemTemplateProps} className="controlsDemo__height36_item" />;
}

RenderDemo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsViewDefault: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                markerVisibility: 'visible',
                navigation: {
                    source: 'page',
                    view: 'infinity',
                    sourceConfig: {
                        pageSize: 10,
                        page: 0,
                        hasMore: false,
                    },
                    viewConfig: {
                        pagingMode: 'basic',
                    },
                },
            },
        },
    };
};
