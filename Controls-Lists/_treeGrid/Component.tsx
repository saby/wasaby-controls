import * as React from 'react';
import {
    ContainerNew as ListContainerConnected,
    IContainerNewProps as IListContainerConnectedProps,
} from 'Controls/baseList';
import { GridView, IGridViewProps, IViewTriggerProps } from 'Controls/gridReact';
import ListContainerHandlersConverter, {
    IListContainerHandlersConverterProps,
} from './ListContainerHandlersConverter';
import { FocusRoot } from 'UI/Focus';
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
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const collectionVersion = useCollectionVersion(props.storeId);

    // todo Сюда необходимо внести код, рассчитывающий отступ для триггера. Сейчас этот код расположен в
    // "Controls\_baseList\Controllers\ScrollController\ObserverController\ObserversController.ts"
    const viewTriggerProps = React.useMemo((): IViewTriggerProps => {
        return {
            offset: 1,
        };
    }, []);

    return (
        <div className="tw-contents" ref={ref}>
            <ListContainerHandlersConverter {...props}>
                <GridView
                    {...props}
                    collectionVersion={collectionVersion}
                    viewTriggerProps={viewTriggerProps}
                />
            </ListContainerHandlersConverter>
        </div>
    );
}
WrappedView.displayName = 'Controls-Lists/_treeGrid:WrappedGridViewReact';

const GridViewForwarded = React.forwardRef(WrappedView);

const Component = React.forwardRef(
    (props: TComponentProps, ref: React.Ref<HTMLDivElement>): JSX.Element => {
        return (
            <FocusRoot
                as="div"
                className={`controls_list_theme-${props.theme} controls_toggle_theme-${props.theme} controls-BaseControl_hover_enabled`}
            >
                <ListContainerConnected
                    storeId={props.storeId}
                    changeRootByItemClick={props.changeRootByItemClick}
                >
                    <GridViewForwarded storeId={props.storeId} ref={ref} />
                </ListContainerConnected>
            </FocusRoot>
        );
    }
);

Component.displayName = 'Controls-Lists/treeGrid:Component';

Component.defaultProps = {
    theme: 'default',
    changeRootByItemClick: false,
};

const ComponentMemo = React.memo(Component);
export default ComponentMemo;
