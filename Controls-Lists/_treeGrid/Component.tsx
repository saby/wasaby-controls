import { activate, FocusRoot } from 'UI/Focus';
import { ChainOfRef } from 'UICore/Ref';
import * as React from 'react';
import {
    ContainerNew as ListContainerConnected,
    IContainerNewProps as IListContainerConnectedProps,
} from 'Controls/baseList';
import { GridView, IGridViewProps, IViewTriggerProps } from 'Controls/gridReact';
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

    // Код ниже для установки фокуса на строке таблицы. Это не является окончательным решением.
    // Сделано по: https://online.sbis.ru/opendoc.html?guid=088270c3-1193-4900-964e-e440c5e7194c&client=3
    // HotKeysContainer сейчас доступен только на wasaby и нельзя портить чистый react-стек списочного контрола.
    // Задача на перевод HotKeysContainer на react:
    // https://online.sbis.ru/opendoc.html?guid=da5371d9-02bc-4b28-99d3-e49cec04fa04&client=3
    // Поэтому принято решение после отрисовки записей устанавливать фокус на список.
    // Для этого создаётся focusAreaRef.
    const [focusVersion, setFocusVersion] = React.useState(0);
    const prevCollectionItem = React.createRef();

    React.useEffect(() => {
        if (
            !props.slice.state.searchInputValue &&
            !!props.collection?.getCount() &&
            prevCollectionItem.current !== props.collection?.at(0)
        ) {
            setFocusVersion((state) => state + 1);
            prevCollectionItem.current = props.collection?.at(0);
        }
    }, [
        props.slice.state.root,
        props.slice.state.searchInputValue,
        !!props.collection?.getCount(),
        props.collection?.at(0),
    ]);
    const activateRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [focusVersion]);

    // Чтобы не потерять ref, передаваемый в props (ref передаётся функцией), объединяем ref'ы утилитой ChainOfRef.
    const finalRef = React.useMemo(
        () => ChainOfRef.both(ref, activateRef),
        [ref, activateRef]
    ) as React.RefObject<HTMLDivElement>;

    // При активации focusRoot переводим фокус на строку списка через утилиту Focus:activate.
    // Активация может случиться, например, при перерисовке строк
    // (активный элемент уничтожается, фокус поднимается на родителя).
    const onActivatedFn = React.useCallback(() => {
        if (activateRef.current) {
            activate(activateRef.current);
        }
    }, [activateRef.current]);

    React.useEffect(() => {
        // Активацию вызываем только при наличии записей, иначе смысла в ней нет.
        if (!!props.collection?.getCount() && activateRef.current) {
            activate(activateRef.current);
        }
    }, [focusVersion]);

    const needShowEmptyTemplate =
        !!props?.slice?.state.emptyView && !!props?.slice?.state?.needShowStub;

    return (
        <FocusRoot
            as="div"
            ref={finalRef}
            className={`controls_list_theme-${props.theme} controls_toggle_theme-${props.theme} controls-BaseControl_hover_enabled`}
            data-qa={props.dataQa}
            autofocus={true}
            onActivated={onActivatedFn}
        >
            <ScrollControllerWrapper {...props}>
                <ListContainerHandlersConverter {...props}>
                    <ItemActionsContextProvider {...props}>
                        <GridView
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
    );
}
WrappedView.displayName = 'Controls-Lists/_treeGrid:WrappedGridViewReact';

const GridViewForwarded = React.forwardRef(WrappedView);

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
