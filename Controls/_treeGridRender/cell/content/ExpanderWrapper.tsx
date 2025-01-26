import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import type { IRowProps, TGetRowPropsCallback } from 'Controls/gridReact';
import { TreeItem } from 'Controls/baseTreeDisplay';
import {
    ExpanderConnectedComponent,
    ExpanderBlockComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/treeRender';

/**
 * Интерфейс свойств строки дерева с колонками
 * @interface Controls/_treeGridRender/renderReact/ContentRenderWithExpander/ITreeRowProps
 * @public
 */
export interface ITreeRowProps extends IRowProps, IExpanderProps {}

/**
 * Функция, возвращающая {@link Controls/_treeGridRender/renderReact/ContentRenderWithExpander/ITreeRowProps свойства строки дерева с колонками}
 * @typedef Controls/_treeGridRender/renderReact/ContentRenderWithExpander/TGetTreeRowPropsCallback
 */
export type TGetTreeRowPropsCallback = TGetRowPropsCallback<ITreeRowProps>;

interface IProps extends IExpanderProps {
    render?: React.ReactElement;
}

export default function ExpanderWrapper(props: IProps) {
    const item = React.useContext(CollectionItemContext) as unknown as TreeItem;
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
