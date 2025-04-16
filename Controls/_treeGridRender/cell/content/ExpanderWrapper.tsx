/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { CollectionItemContext, ICollectionItemContextValue } from 'Controls/listsCommonLogic';
import { TreeItem } from 'Controls/baseTreeDisplay';
import {
    ExpanderConnectedComponent,
    ExpanderBlockComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/treeRender';

interface IProps extends IExpanderProps {
    render?: React.ReactElement;
}

/**
 * Приватный компонент, отрисовывающий expander (кнопку разорота узла) или отступ под expander
 * @private
 */
export default function ExpanderWrapper(props: IProps) {
    const collectionItemContextValue = React.useContext(
        CollectionItemContext
    ) as ICollectionItemContextValue;
    const item = collectionItemContextValue.item as unknown as TreeItem;
    const expanderProps = getExpanderProps(props, item);

    return React.useMemo(() => {
        return (
            <>
                <ExpanderBlockComponent {...expanderProps} />
                {props.render}
                {props.expanderPosition === 'right' && (
                    <ExpanderConnectedComponent {...expanderProps} />
                )}
            </>
        );
    }, [
        props.render,
        props.expanderPosition,
        expanderProps.expanderSize,
        expanderProps.expanderIcon,
        expanderProps.expanderIconSize,
        expanderProps.expanderIconStyle,
        expanderProps.withoutExpanderPadding,
        expanderProps.levelIndentSize,
        expanderProps.withoutLevelPadding,
        expanderProps.hasChildren,
        expanderProps.level,
        expanderProps.expanded,
        expanderProps.expanderPaddingVisibility,
        expanderProps.expanderPosition,
        expanderProps.expanderVisibility,
        expanderProps.directionality,
        expanderProps.style,
        expanderProps.node,
        expanderProps.dataQaPrefix,
    ]);
}
