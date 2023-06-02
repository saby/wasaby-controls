import * as React from 'react';

import 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { TExpanderPosition } from 'Controls/baseTree';

import { getBaseColumns, getBaseRecordSet } from '../Data';

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

        const [expanderPosition, setExpanderPosition] =
            React.useState<TExpanderPosition>(
                props.expanderPosition || 'default'
            );

        return (
            <div
                ref={ref}
                className={'controlsDemo__wrapper controlsDemo__maxWidth500'}
            >
                <select
                    onChange={(event) => {
                        return setExpanderPosition(event.target.value as TExpanderPosition);
                    }}
                    value={expanderPosition}
                    data-qa={'expander-position-selector'}
                >
                    <option value={'default'}>Default expander position</option>
                    <option value={'right'}>Right expander position</option>
                    <option value={'custom'}>Custom expander position</option>
                </select>

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
