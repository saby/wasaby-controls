import * as React from 'react';
import type { TreeItem } from 'Controls/baseTreeDisplay';
import { ExpanderBlockComponent, getExpanderProps } from './ExpanderComponent';

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
