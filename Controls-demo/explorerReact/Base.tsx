import * as React from 'react';
import { HierarchicalMemory } from 'Types/source';
import { View } from 'Controls/explorer';
import { Gadgets } from '../explorerNew/DataHelpers/DataCatalog';
import { useTumbler } from '../gridReact/Dev/Editors/Tumbler';
import { Model } from 'Types/entity';

import 'Controls/gridReact';

const SOURCE = new HierarchicalMemory({
    keyProperty: 'id',
    parentProperty: 'parent',
    data: Gadgets.getData(),
});

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
        width: '200px',
    },
    {
        key: 'discr',
        displayProperty: 'discr',
        width: '1fr',
    },
    {
        key: 'price',
        displayProperty: 'price',
        width: '1fr',
    },
];

const CUSTOM_EVENTS = ['onHoveredCellChanged'];

export default React.forwardRef(function BaseComponent(_: object, ref): JSX.Element {
    const [hasContentInFirstHeaderCell, HasContentInFirstHeaderCellTumbler] = useTumbler<boolean>(
        'Прикладной контент в первой ячейке шапки',
        [true, false],
        true
    );

    const [hoveredCellLog, setHoveredCellLog] = React.useState('null');

    const header = React.useMemo(() => {
        const result = [
            {
                key: 'title_header',
            },
            {
                key: 'discr_header',
                caption: 'Header',
            },
            {
                key: 'price_header',
                caption: 'Header',
            },
        ];

        if (hasContentInFirstHeaderCell) {
            result[0].caption = 'Header';
        }

        return result;
    }, [hasContentInFirstHeaderCell]);

    const onHoveredCellChanged = React.useCallback(
        (
            item: Model,
            itemContainer: HTMLDivElement | null,
            cellIndex: number
        ) => {
            setHoveredCellLog(item ? 'key: ' + item.getKey() + '; cell: ' + cellIndex : 'null');
        },
        []
    );

    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            {HasContentInFirstHeaderCellTumbler}
            <div>{hoveredCellLog}</div>
            <View
                source={SOURCE}
                header={header}
                columns={COLUMNS}
                backgroundStyle="default"
                keyProperty="id"
                displayProperty="title"
                parentProperty="parent"
                nodeProperty="parent@"
                viewMode="table"
                onHoveredCellChanged={onHoveredCellChanged}
                customEvents={CUSTOM_EVENTS}
            />
        </div>
    );
});
