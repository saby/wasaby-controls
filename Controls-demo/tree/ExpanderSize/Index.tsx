import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeView, ItemTemplate } from 'Controls/tree';

import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';
import { TInternalProps } from 'UICore/Executor';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            parent: 1,
            type: true,
        },
        {
            key: 111,
            title: 'Leaf',
            parent: 11,
            type: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            parent: 1,
            type: false,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            parent: 1,
            type: null,
        },
        {
            key: 2,
            title: 'Node 2',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            parent: 2,
            type: null,
        },
        {
            key: 3,
            title: 'Node 3',
            parent: null,
            type: true,
            hasChild: false,
        },
    ];
}

function SizeSelector(props: {
    value: string;
    onChange: (value: string) => void;
    name: string;
    values: string[];
    'data-qa': string;
}): React.ReactElement {
    return (
        <label>
            <span>{props.name}</span>
            <select
                value={props.value}
                data-qa={props['data-qa']}
                onChange={(event) => {
                    return props.onChange(event.target.value);
                }}
            >
                {props.values.map((value) => {
                    return <option value={value}>{value}</option>;
                })}
            </select>
        </label>
    );
}

const itemPadding = {
    top: 'default',
    bottom: 'default',
    left: 'null',
    right: 'null',
};

const expanderSizeValues = ['l', 's', 'xs'];
const expanderIconSizeValues = ['default', '2xs'];

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/node/expander/#expander-size
 */
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [expanderSize, setExpanderSize] = React.useState('l');
    const [expanderIconSize, setExpanderIconSize] = React.useState('default');
    const itemTemplate = React.useMemo(() => {
        return React.forwardRef((refProps) => {
            return (
                <ItemTemplate
                    {...refProps}
                    expanderSize={expanderSize}
                    expanderIconSize={expanderIconSize}
                />
            );
        });
    }, [expanderSize, expanderIconSize]);

    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <TreeView storeId="listData" itemTemplate={itemTemplate} itemPadding={itemPadding} />
            <br />
            <SizeSelector
                value={expanderSize}
                onChange={setExpanderSize}
                name={'expanderSize'}
                values={expanderSizeValues}
                data-qa={'selector-expanderSize'}
            />
            <SizeSelector
                value={expanderIconSize}
                onChange={setExpanderIconSize}
                name={'expanderIconSize'}
                values={expanderIconSizeValues}
                data-qa={'selector-expanderIconSize'}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [null],
                },
            },
        };
    },
});
