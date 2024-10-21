import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { useContent } from 'UICore/Jsx';
import { HierarchicalMemory } from 'Types/source';
import { View as ExplorerView } from 'Controls/explorer';
import { IColumn, IHeaderCell } from 'Controls/grid';
import {
    SmallItemTemplate as SmallTileItemTemplate,
    ItemTemplate as BaseTileItemTemplate,
    ITileItemProps,
} from 'Controls/tile';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { IToolbarOptions, View as Toolbar } from 'Controls/toolbars';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { useSlice } from 'Controls-DataEnv/context';

import { getFlatList } from 'Controls-ListEnv-demo/WI/Explorer/Data';
import * as filter from 'Controls-ListEnv-demo/StoreIdConnected/DataFilter';

const COUNT_ITEMS = 5;

const columns: IColumn[] = [
    { displayProperty: 'title', width: '150px' },
    { displayProperty: 'country' },
    { displayProperty: 'type' },
    { displayProperty: 'screenType' },
    { displayProperty: 'company' },
    { displayProperty: 'available' },
];

const header: IHeaderCell[] = [
    { caption: 'Название' },
    { caption: 'Страна' },
    { caption: 'Тип' },
    { caption: 'Тип экрана' },
    { caption: 'Производитель' },
    { caption: 'Наличие' },
];

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('ViewModeExplorer');

    const style = React.useMemo(() => {
        return {
            width: '800px',
        };
    }, []);

    const DemoToolbar = useContent((props: IToolbarOptions) => {
        return <Toolbar {...props} direction="vertical" />;
    });

    const DemoTileItemTemplate = useContent((props: ITileItemProps) => {
        return props.item.contents.get('node') !== null ? (
            <SmallTileItemTemplate {...props} className={'controls-background-unaccented'} />
        ) : (
            <BaseTileItemTemplate
                {...props}
                className={'controls-background-info'}
                hasTitle={true}
            />
        );
    });

    return (
        <div
            className="ws-flexbox controls_border-radius-m controls-padding-m controls-background-unaccented"
            ref={ref}
            style={style}
        >
            <div className="ws-flexbox ws-flex-column engine-demo__Widgets_list controls-background-default controls-padding-xs tw-w-full">
                <div className="controls-padding_bottom-xs">
                    <SearchInput storeId="ViewModeExplorer" contrastBackground={true} />
                </div>
                <ExplorerView
                    storeId="ViewModeExplorer"
                    className="engine-demo__Widgets_list"
                    backgroundStyle="default"
                    columns={columns}
                    header={header}
                    imageProperty="image"
                    tileScalingMode="none"
                    tileMode={'dynamic'}
                    tileWidth={200}
                    folderWidth={250}
                    tileItemTemplate={DemoTileItemTemplate}
                />
            </div>
            <ToolbarContainer
                storeId="ViewModeExplorer"
                actions={slice?.state.listActions}
                content={DemoToolbar}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig() {
        return {
            ViewModeExplorer: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getFlatList(['США', 'Южная Корея', 'Тайвань'], COUNT_ITEMS),
                        parentProperty: 'parent',
                        filter,
                    }),
                    listActions: 'Controls-ListEnv-demo/WI/Explorer/listActions',
                    searchParam: 'title',
                    displayProperty: 'title',
                    multiSelectVisibility: 'onhover',
                    keyProperty: 'id',
                    viewMode: 'table',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                },
            },
        };
    },
});
