import * as React from 'react';
import { TreeItem } from 'Controls/tree';
import {
    ExpanderBlockComponent,
    getExpanderProps,
} from 'Controls/_baseTree/render/ExpanderComponent';

interface FooterCellWithExpanderProps {
    render: React.ReactElement;
    owner: TreeItem;
}

export function FooterCellWithExpander(props: FooterCellWithExpanderProps) {
    const { render, owner } = props;
    return (
        <>
            <ExpanderBlockComponent {...getExpanderProps({}, owner)} />
            {render}
        </>
    );
}
