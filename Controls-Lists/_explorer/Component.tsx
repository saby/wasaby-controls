/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractListComponentProps } from 'Controls-Lists/abstractList';
import { IAbstractComponentAPI } from 'Controls-Lists/abstractList';
import { _private_extractUtil, AbstractListSlice } from 'Controls-DataEnv/abstractList';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { LibPaths } from 'Controls-DataEnv/staticLoader';
import type * as TreeGridLib from 'Controls-Lists/treeGrid';
import type * as TreeTileLib from 'Controls-Lists/treeTile';
import type { IComponentProps as ITreeTileComponentProps } from 'Controls-Lists/treeTile';

export interface IComponentProps extends IAbstractListComponentProps {
    tileItemRender?: ITreeTileComponentProps['itemTemplate'];
    tileGroupRender?: ITreeTileComponentProps['groupTemplate'];
}

export const Component = React.forwardRef(
    (props: IComponentProps, ref: React.ForwardedRef<IAbstractComponentAPI | undefined>) => {
        const { changeRootByItemClick = true, storeId, tileItemRender, tileGroupRender } = props;
        const slice = useStrictSlice<AbstractListSlice>(storeId);

        if (!slice) {
            return null;
        }

        const viewMode = slice.state.viewMode || 'table';
        const commonProps: IAbstractListComponentProps = _private_extractUtil(
            props,
            [
                'storeId',
                'onItemClick',
                'expandByItemClick',
                'dataQa',
                'theme',
                'className',
                'style',
                'readOnly',

                'itemsDragNDrop',
                'dragStartDelay',
                'draggingRender',
                'onDragStart',
                'onDragMove',
                'onDragEnd',
                'onChangeDragTarget',

                'virtualScrollConfig',
            ],
            void 0,
            {
                changeRootByItemClick,
                ref: ref as React.RefObject<IAbstractComponentAPI | undefined>,
            }
        );

        switch (viewMode) {
            case 'tile': {
                return ComponentResolvers.tile((InnerComponent) => (
                    <InnerComponent
                        {...commonProps}
                        itemTemplate={tileItemRender}
                        groupTemplate={tileGroupRender}
                    />
                ));
            }
            default: {
                return ComponentResolvers.table((InnerComponent) => (
                    <InnerComponent {...commonProps} />
                ));
            }
        }
    }
);

Component.displayName = 'Controls-Lists/explorer:Component';

const ComponentResolvers = {
    list: () => null,
    table: (cb: TRenderCallback<typeof TreeGridLib, 'Component'>) =>
        withValidation<typeof TreeGridLib, 'Component'>(LibPaths.NewTreeGrid, 'Component', cb),
    tile: (cb: TRenderCallback<typeof TreeTileLib, 'Component'>) =>
        withValidation<typeof TreeTileLib, 'Component'>(LibPaths.NewTreeTile, 'Component', cb),
    composite: () => null,
    search: () => null,
    searchTile: () => null,
} as const;

type TRenderCallback<TLib, TComponentCtorName extends keyof TLib> = (
    InnerComponent: TLib[TComponentCtorName]
) => React.ReactElement;

function withValidation<TLib, TComponentCtorName extends keyof TLib>(
    libPath: string,
    componentName: TComponentCtorName,
    cb: TRenderCallback<TLib, TComponentCtorName>
): null | ReturnType<TRenderCallback<TLib, TComponentCtorName>> {
    if (!isLoaded(libPath)) {
        return null;
    }

    return cb(loadSync<TLib>(libPath)[componentName]);
}
