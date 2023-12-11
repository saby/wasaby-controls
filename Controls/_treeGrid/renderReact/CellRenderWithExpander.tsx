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
 * @interface Controls/_treeGrid/renderReact/CellRenderWithExpander/ITreeRowProps
 * @public
 */
export interface ITreeRowProps extends IRowProps, IExpanderProps {}
export interface ITreeRowComponentProps extends IRowComponentProps, IExpanderProps {}
export interface ITreeCellComponentProps extends ICellComponentProps, IExpanderProps {}

/**
 * Функция, возвращающая {@link Controls/_treeGrid/renderReact/CellRenderWithExpander/ITreeRowProps свойства строки дерева с колонками}
 * @typedef Controls/_treeGrid/renderReact/CellRenderWithExpander/TGetTreeRowPropsCallback
 */
export type TGetTreeRowPropsCallback = TGetRowPropsCallback<ITreeRowProps>;

interface IProps extends IExpanderProps {
    render?: React.ReactElement;
}

function CellRenderWithExpander(props: IProps) {
    const item = React.useContext(CollectionItemContext) as unknown as TreeItem;

    return (
        <>
            <ExpanderBlockComponent {...getExpanderProps(props, item)} />
            {props.render}
            {props.expanderPosition === 'right' && (
                <ExpanderComponent {...getExpanderProps(props, item)} />
            )}
        </>
    );
}

export default React.memo(CellRenderWithExpander);
