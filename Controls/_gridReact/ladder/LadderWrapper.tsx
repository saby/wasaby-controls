/*
 * Файл содержит публичный компонент LadderWrapper, который используется для многострочной лесенки
 * в шаблоне контента ячейки.
 * Демо: Controls-demo/gridReact/Ladder/StickyMultiline/Index
 */

import * as React from 'react';
import { useItemData } from 'Controls/_gridReact/hooks/useItemData';
import { Model } from 'Types/entity';
import { StickyPropertyContext } from 'Controls/_gridReact/ladder/StickyPropertyContext';
import { CollectionItemContext } from 'Controls/baseList';

interface LadderWrapperProps {
    ladderProperty: string;
    className?: string;
    children: React.Node;
    stickyProperty: [string, string];
}

function LadderWrapper(props: LadderWrapperProps) {
    const currentCell = React.useContext(StickyPropertyContext) ?? null;
    const item = React.useContext(CollectionItemContext);
    const { ladderProperty, className, children, stickyProperty } = props;
    const ladderData = useItemData<Model>([ladderProperty]);
    const { renderValues } = useItemData<Model>(
        typeof stickyProperty === 'string' ? [stickyProperty] : stickyProperty
    );

    if (stickyProperty) {
        if (currentCell === null) {
            return (
                <div style={{ visibility: 'hidden' }} className={className}>
                    {children}
                </div>
            );
        }

        if (currentCell === stickyProperty[0] && currentCell === ladderProperty) {
            return <div className={className}>{children}</div>;
        }

        if (currentCell === stickyProperty[0] && currentCell !== ladderProperty) {
            return null;
        }

        if (currentCell === stickyProperty[1] && currentCell !== ladderProperty) {
            return (
                <div style={{ visibility: 'hidden' }} className={className}>
                    {children}
                </div>
            );
        }

        if (
            currentCell === stickyProperty[1] &&
            currentCell === ladderProperty &&
            renderValues[stickyProperty[0]] === null
        ) {
            return <div className={className}>{children}</div>;
        }

        if (currentCell === stickyProperty[1] && currentCell === ladderProperty) {
            return (
                <div style={{ position: 'absolute' }} className={className}>
                    {children}
                </div>
            );
        }
    } else {
        if (!ladderData.renderValues[ladderProperty]) {
            if (item.getLadderMode() === 'visibility') {
                return (
                    <div style={{ visibility: 'hidden' }} className={className}>
                        {children}
                    </div>
                );
            } else {
                return (
                    <div style={{ display: 'none' }} className={className}>
                        {children}
                    </div>
                );
            }
        }
    }
    return <div className={className}>{children}</div>;
}

export default LadderWrapper;
