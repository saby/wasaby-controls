import * as React from 'react';
import { RecordSet } from 'Types/collection';
import {
    ItemsView as ListView,
    ItemTemplate as ListItemTemplate,
} from 'Controls/list';
import {
    ItemsView as GridView,
    ItemTemplate as GridItemTemplate,
} from 'Controls/grid';
import {
    ItemsView as TreeGridView,
    ItemTemplate as TreeGridItemTemplate,
} from 'Controls/treeGrid';
import {
    ItemsView as TreeView,
    ItemTemplate as TreeItemTemplate,
} from 'Controls/tree';
import {
    ItemsView as TileView,
    ItemTemplate as TileItemTemplate,
} from 'Controls/tile';
import {
    ItemsView as ColumnsView,
    ItemTemplate as ColumnsItemTemplate,
} from 'Controls/columns';
import { Button } from 'Controls/buttons';
import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';

const data = [
    {
        key: 1,
        title: 'Notebooks',
        node: true,
        parent: null,
    },
    {
        key: 2,
        title: 'Tablets',
        node: false,
        parent: null,
    },
    {
        key: 3,
        title: 'Laptop computers',
        node: null,
        parent: null,
    },
    {
        key: 4,
        title: 'Apple gadgets',
        node: null,
        parent: null,
    },
    {
        key: 5,
        title: 'Android gadgets',
        node: null,
        parent: null,
    },
];
const items = new RecordSet({
    keyProperty: 'key',
    rawData: data,
});

type TMode = 'list' | 'grid' | 'treeGrid' | 'tree' | 'columns' | 'tile';
const MODES: TMode[] = ['list', 'grid', 'treeGrid', 'tree', 'columns', 'tile'];

function getViewTemplates(mode: TMode): {
    View: React.Component;
    ItemTemplate: React.Component;
} {
    switch (mode) {
        case 'list':
            return { View: ListView, ItemTemplate: ListItemTemplate };
        case 'grid':
            return { View: GridView, ItemTemplate: GridItemTemplate };
        case 'treeGrid':
            return { View: TreeGridView, ItemTemplate: TreeGridItemTemplate };
        case 'tree':
            return { View: TreeView, ItemTemplate: TreeItemTemplate };
        case 'columns':
            return { View: ColumnsView, ItemTemplate: ColumnsItemTemplate };
        case 'tile':
            return { View: TileView, ItemTemplate: TileItemTemplate };
    }
}

let MODE_INDEX = 0;
export default React.forwardRef(function MarkerClassName(
    props,
    ref
): JSX.Element {
    const [mode, setMode] = React.useState<TMode>(MODES[MODE_INDEX]);

    const changeMode = () => {
        MODE_INDEX++;
        const newMode = MODES[MODE_INDEX % MODES.length];
        setMode(newMode);
    };

    const { View, ItemTemplate } = getViewTemplates(mode);
    return (
        <div
            ref={ref}
            className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}
        >
            {`Current mode ${mode}`}
            <br />
            <Button caption={'Change mode'} onClick={changeMode} />
            <View
                items={items}
                keyProperty={'key'}
                nodeProperty={'node'}
                parentProperty={'parent'}
                displayProperty={'title'}
                columns={[{ displayProperty: 'title' }]}
                root={null}
                markerVisibility={'visible'}
                itemTemplate={(innerProps) => {
                    return (
                        <ItemTemplate
                            {...innerProps}
                            className={
                                'controlsDemo__listNew__MarkerClassName_item'
                            }
                            markerClassName={
                                'controlsDemo__listNew__MarkerClassName_marker'
                            }
                        />
                    );
                }}
            />
        </div>
    );
});
