/**
 * @kaizen_zone e0faa54f-0242-4b8d-a3c5-10c9d5cf59b8
 */
import { FocusRoot } from 'UI/Focus';
import * as React from 'react';
import {
    ContainerNew as ListContainerConnected,
    IContainerNewProps as IListContainerConnectedProps,
} from 'Controls/baseList';
import { IGridViewProps, IViewTriggerProps } from 'Controls/gridReact';
import { ReactTreeGridView } from 'Controls/treeGrid';
import ScrollControllerWrapper from './ScrollControllerWrapper';
import ListContainerHandlersConverter, {
    IListContainerHandlersConverterProps,
} from './ListContainerHandlersConverter';
import 'css!Controls/baseList';
import 'css!Controls/list';
import 'css!Controls/grid';
import 'css!Controls/gridReact';
import 'css!Controls/baseTree';
import { useCollectionVersion } from 'Controls-Lists/_treeGrid/useCollectionVersion';
import { TComponentProps } from './interface/IComponentProps';
import { ItemActionsContextProvider } from 'Controls/itemActions';
import HotKeysContainerReact from './HotKeysContainer';

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

    const needShowEmptyTemplate =
        !!props?.slice?.state.emptyView && !!props?.slice?.state?.needShowStub;

    return (
        <HotKeysContainerReact ref={ref} {...props}>
            <FocusRoot
                as="div"
                className={`controls_list_theme-${props.theme} controls_toggle_theme-${props.theme} controls-BaseControl_hover_enabled`}
                data-qa={props.dataQa}
                ref={ref}
                autofocus={true}
            >
                <ScrollControllerWrapper {...props}>
                    <ListContainerHandlersConverter {...props}>
                        <ItemActionsContextProvider {...props}>
                            <ReactTreeGridView
                                {...props}
                                needShowEmptyTemplate={needShowEmptyTemplate}
                                collectionVersion={collectionVersion}
                                viewTriggerProps={viewTriggerProps}
                                // 1. В списках с BaseControl создаётся собственный фокус-элемент ("fakeFocusElement").
                                // 2. В "чистом списке" фокусировка происходит прямо на записи списка.
                                // Эти два поведения конфликтуют и для их разграничения введён параметр "innerFocusElement".
                                innerFocusElement={true}
                            />
                        </ItemActionsContextProvider>
                    </ListContainerHandlersConverter>
                </ScrollControllerWrapper>
            </FocusRoot>
        </HotKeysContainerReact>
    );
}
WrappedView.displayName = 'Controls-Lists/_treeGrid:WrappedGridViewReact';

const GridViewForwarded = React.forwardRef(WrappedView);

/**
 * Компонент "Иерархическая таблица".
 */
const Component = React.forwardRef(
    (props: TComponentProps, ref: React.Ref<HTMLDivElement>): JSX.Element => {
        return (
            <ListContainerConnected
                storeId={props.storeId}
                changeRootByItemClick={props.changeRootByItemClick}
            >
                <GridViewForwarded
                    storeId={props.storeId}
                    ref={ref}
                    theme={props.theme}
                    dataQa={props.dataQa || props['data-qa']}
                    onItemClick={props.onItemClick}
                />
            </ListContainerConnected>
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
