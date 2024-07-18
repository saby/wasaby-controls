import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import type {
    ICellComponentProps,
    IRowComponentProps,
    IRowProps,
    TGetRowPropsCallback,
} from 'Controls/gridReact';
import {
    TreeItem,
    ExpanderBlockComponent,
    ExpanderComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/baseTree';

/**
 * Интерфейс свойств строки дерева с колонками
 * @interface Controls/_baseTreeGrid/renderReact/CellRenderWithExpander/ITreeRowProps
 * @public
 */
export interface ITreeRowProps extends IRowProps, IExpanderProps {}

export interface ITreeRowComponentProps extends IRowComponentProps, IExpanderProps {}

export interface ITreeCellComponentProps extends ICellComponentProps, IExpanderProps {
    minHeight?: 'null' | 'default';
}

/**
 * Функция, возвращающая {@link Controls/_baseTreeGrid/renderReact/CellRenderWithExpander/ITreeRowProps свойства строки дерева с колонками}
 * @typedef Controls/_baseTreeGrid/renderReact/CellRenderWithExpander/TGetTreeRowPropsCallback
 */
export type TGetTreeRowPropsCallback = TGetRowPropsCallback<ITreeRowProps>;

interface IProps extends IExpanderProps {
    render?: React.ReactElement;
}

export default function CellRenderWithExpander(props: IProps) {
    const item = React.useContext(CollectionItemContext) as unknown as TreeItem;
    const expanderProps = getExpanderProps(props, item);

    return React.useMemo(() => {
        return (
            <>
                <ExpanderBlockComponent {...expanderProps} />
                {props.render}
                {props.expanderPosition === 'right' && <ExpanderComponent {...expanderProps} />}
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
