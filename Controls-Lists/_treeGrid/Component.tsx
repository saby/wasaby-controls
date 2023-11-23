import * as React from 'react';
import {
    ContainerNew as ListContainerConnected,
    IContainerNewProps as IListContainerConnectedProps,
} from 'Controls/baseList';
import { GridView, IGridViewProps } from 'Controls/gridReact';
import ListContainerHandlersConverter, {
    IListContainerHandlersConverterProps,
} from './ListContainerHandlersConverter';
import 'css!Controls/baseList';
import 'css!Controls/list';
import 'css!Controls/grid';
import 'css!Controls/gridReact';
import 'css!Controls/baseTree';
import { useCollectionVersion } from 'Controls-Lists/_treeGrid/useCollectionVersion';

type TComponentDefaultProps = {
    theme: string;
};

interface ITreeGridProps {
    changeRootByItemClick: boolean;
}

export type TComponentProps = Partial<TComponentDefaultProps> &
    Pick<IListContainerConnectedProps, 'storeId'> &
    ITreeGridProps;

function WrappedView(
    props: IListContainerHandlersConverterProps &
        IGridViewProps &
        Pick<IListContainerConnectedProps, 'storeId'>,
    ref
) {
    const collectionVersion = useCollectionVersion(props.storeId);
    return (
        <div className="tw-contents" ref={ref}>
            <ListContainerHandlersConverter {...props}>
                <GridView {...props} collectionVersion={collectionVersion} />
            </ListContainerHandlersConverter>
        </div>
    );
}

const GridViewForwarded = React.forwardRef(WrappedView);

function Component(props: TComponentProps): JSX.Element {
    return (
        <div
            className={`controls_list_theme-${props.theme} controls_toggle_theme-${props.theme} controls-BaseControl_hover_enabled`}
        >
            <ListContainerConnected
                storeId={props.storeId}
                changeRootByItemClick={props.changeRootByItemClick}
            >
                <GridViewForwarded storeId={props.storeId} />
            </ListContainerConnected>
        </div>
    );
}

Component.defaultProps = {
    theme: 'default',
    changeRootByItemClick: false,
};

const ComponentMemo = React.memo(Component);
export default ComponentMemo;
