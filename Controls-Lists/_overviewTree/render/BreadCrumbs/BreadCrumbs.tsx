import { BreadCrumbItem } from 'Controls-Lists/_overviewTree/render/BreadCrumbs/BreadCrumbsItem';
import { ListSlice } from 'Controls/dataFactory';
import * as React from 'react';
import type { TKey } from 'Controls-DataEnv/interface';

interface IBreadCrumbsProps {
    slice: ListSlice;
    breadCrumbs: TKey[];
}

export function BreadCrumbs({ slice, breadCrumbs }: IBreadCrumbsProps): React.ReactElement {
    return (
        <div className={'ControlsLists-overviewTree__breadCrumbs_wrapper'}>
            {breadCrumbs.map((id, index) => {
                if (!id) return null;

                const record = slice.state.items?.getRecordById(id);

                if (!record) return null;

                const parentValue = record.get(slice.state.parentProperty);
                const nodeValue = record.get(slice.state.nodeProperty);

                const isRoot = parentValue === slice.state.root;
                const isNode = !isRoot && !!nodeValue;

                const className = [
                    'ControlsLists-overviewTree__breadCrumbsItem ',
                    isRoot && 'ControlsLists-overviewTree__breadCrumbsItem__root ',
                    isNode && 'ControlsLists-overviewTree__breadCrumbsItem__node ',
                ]
                    .filter(Boolean)
                    .join(' ');

                return (
                    <BreadCrumbItem
                        key={id}
                        title={record.get(slice.state.displayProperty)}
                        isLast={index === breadCrumbs.length - 1}
                        className={className}
                    />
                );
            })}
        </div>
    );
}
