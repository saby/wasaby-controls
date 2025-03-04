import { useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import { View, ItemTemplate } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { CrudEntityKey, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 50;

function getData() {
    return generateData<{
        key: number;
        title: string;
        description: string;
        column: number;
    }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string', description: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
            // eslint-disable-next-line
            item.column = item.key < 10 ? 0 : item.key > 23 ? 1 : 2;
        },
    });
}

const RenderDemo = forwardRef(function (props, ref) {
    const [items, setItems] = useState<RecordSet>();
    // eslint-disable-next-line react/hook-use-state
    const [itemActions] = useState(() => {
        return [
            {
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'delete',
                showType: 2,
                handler(item: any): void {
                    const index = items.getIndex(item);
                    items.removeAt(index);
                },
            } as const,
        ];
    });
    const [selectedKeys, setSelectedKeys] = useState<CrudEntityKey[]>([]);
    const onSelectedKeysChanged = useCallback((keys: CrudEntityKey[]) => {
        setSelectedKeys(keys);
    }, []);
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    const itemsReadyCallback = useCallback((newItems) => {
        if (isMountedRef.current) {
            setItems(newItems);
        }
    }, []);
    const removeItems = useCallback(() => {
        const items = selectedKeys;
        let item;
        for (let i = 0; i < items.length; i++) {
            item = items.getRecordById(items[i]);
            if (item) {
                items.remove(item);
            }
        }
        setSelectedKeys([]);
    }, []);
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div onClick={removeItems}>remove selected items</div>
            <Container className="controlsDemo__height400 controlsDemo__minWidth600">
                <View
                    storeId="ColumnsViewCustomTemplate"
                    columnsMode="auto"
                    multiSelectPosition="custom"
                    itemsReadyCallback={itemsReadyCallback}
                    itemActionsClass="controls-itemActionsV_position_bottomRight"
                    itemActions={itemActions}
                    name="view"
                    onSelectedKeysChanged={onSelectedKeysChanged}
                    itemTemplate={itemTemplate}
                />
            </Container>
        </div>
    );
});

export default RenderDemo;

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            highlightOnHover={false}
            shadowVisibility="hidden"
            itemActionsClass="controls-itemActionsV_position_topRight"
            contentTemplate={(contentTemplateProps) => {
                // Опция шаблона имеет приоритет
                return (
                    <div className="controlsDemo_ColumnsView_itemTemplate-wrapper controlsDemo_ColumnsView_itemTemplate-border">
                        <contentTemplateProps.multiSelectTemplate
                            item={contentTemplateProps.item}
                        />
                        <div className="controlsDemo_ColumnsView_itemTemplate-title">
                            {contentTemplateProps.item.getContents().get('title')}{' '}
                            {contentTemplateProps.item._contentsIndex}
                        </div>
                        <div className="controlsDemo_ColumnsView_itemTemplate-description">
                            {contentTemplateProps.item.getContents().get('description')}
                        </div>
                    </div>
                );
            }}
        ></ItemTemplate>
    );
}

RenderDemo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsViewCustomTemplate: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                markerVisibility: 'visible',
                multiSelectVisibility: 'visible',
                navigation: {
                    source: 'page',
                    view: 'infinity',
                    sourceConfig: {
                        page: 0,
                        pageSize: 50,
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
