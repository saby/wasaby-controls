import * as React from 'react';
import { Component } from 'Controls-Lists/treeGrid';
import { HierarchicalMemory as Memory } from 'Types/source';
import { TESTS, TESTS_COUNT } from 'Controls-Lists-demo/UnitMap/Units';
import { HeadingPath } from 'Controls-ListEnv/breadcrumbs';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { AbstractListSlice } from 'Controls-DataEnv/abstractList';

const STORE_ID = 'grid_simple';
const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';

const Simple = React.memo(
    React.forwardRef(function Simple(
        _props: {},
        ref: React.ForwardedRef<HTMLDivElement>
    ): JSX.Element {
        const slice = useStrictSlice<AbstractListSlice>(STORE_ID);

        return (
            <div ref={ref}>
                {/* @ts-ignore */}
                <HeadingPath storeId={STORE_ID} />
                {slice.state.root === null && `Всего тестов: ${TESTS_COUNT}.`}
                <Component
                    storeId={STORE_ID}
                    changeRootByItemClick={true}
                    onItemClick={(item) => {
                        // @ts-ignore
                        alert(item.get('meta'));
                    }}
                />
            </div>
        );
    })
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Simple.getLoadConfig = () => ({
    [STORE_ID]: {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            collectionType: 'TreeGrid',
            source: SOURCE,
            columns: COLUMNS,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
        },
    },
});

// @ts-ignore
const SOURCE = new Memory({
    // @ts-ignore
    data: TESTS.map(({ id, parent, name, isZone, meta }) => ({
        [KEY_PROPERTY]: id,
        [PARENT_PROPERTY]: parent,
        [NODE_PROPERTY]: isZone ? false : null,
        title: name,
        // @ts-ignore
        meta: isZone ? `Это зона: ${name}.` : `Это тест с id=${meta.id}.`,
    })),
    keyProperty: KEY_PROPERTY,
    parentProperty: PARENT_PROPERTY,
});

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
    },
];

export default Simple;
