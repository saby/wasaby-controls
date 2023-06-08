import * as React from 'react';

import { getArgs } from 'UICore/Events';

import 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { Control as Tumbler } from 'Controls/Tumbler';
import { TExpanderPosition } from 'Controls/baseTree';
import { RecordSet } from 'Types/collection';

import { getBaseColumns, getBaseRecordSet } from '../Data';

function getExpanderPositions(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [{ key: 'default' }, { key: 'right' }, { key: 'custom' }],
    });
}

interface IProps {
    expanderPosition?: TExpanderPosition;
}

export default React.forwardRef(
    (props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const columns = React.useMemo(() => {
            return getBaseColumns();
        }, []);
        const items = React.useMemo(() => {
            return getBaseRecordSet();
        }, []);
        const expanderPositions = React.useMemo(() => {
            return getExpanderPositions();
        }, []);

        const [expanderPosition, setExpanderPosition] =
            React.useState<TExpanderPosition>(
                props.expanderPosition || 'default'
            );

        return (
            <div
                ref={ref}
                className={'controlsDemo__wrapper controlsDemo__maxWidth500'}
            >
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={expanderPositions}
                    selectedKey={expanderPosition}
                    onSelectedKeyChanged={(event) => {
                        return setExpanderPosition(getArgs(event)[1]);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                />
                <TreeGridItemsView
                    items={items}
                    columns={columns}
                    root={null}
                    keyProperty={'key'}
                    nodeProperty={'type'}
                    parentProperty={'parent'}
                    expanderPosition={expanderPosition}
                />
            </div>
        );
    }
);
