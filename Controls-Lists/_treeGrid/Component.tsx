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
    const focusAreaRef = React.useRef<HTMLElement | undefined>();
    // Чтобы не потерять ref, передаваемый в props (ref передаётся функцией), объединяем ref'ы утилитой ChainOfRef.
    const finalRef = React.useMemo(() => ChainOfRef.both(ref, focusAreaRef), [ref]);

    React.useEffect(() => {
        // Активацию вызываем только при наличии записей, иначе смысла в ней нет.
        if (!!props.collection?.getCount() && focusAreaRef.current) {
            activate(focusAreaRef.current);
        }
    }, [focusAreaRef.current, !!props.collection?.getCount()]);

    return (
        <div className="tw-contents" ref={finalRef}>
            <ScrollControllerWrapper {...props}>
                <ListContainerHandlersConverter {...props}>
                    <GridView
                        {...props}
                        collectionVersion={collectionVersion}
                        viewTriggerProps={viewTriggerProps}
                        // 1. В списках с BaseControl создаётся собственный фокус-элемент ("fakeFocusElement").
                        // 2. В "чистом списке" фокусировка происходит прямо на записи списка.
                        // Эти два поведения конфликтуют и для их разграничения введён параметр "innerFocusElement".
                        innerFocusElement={true}
                    />
                </ListContainerHandlersConverter>
            </ScrollControllerWrapper>
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
                data-qa={props.dataQa || props['data-qa']}
            >
                <ListContainerConnected
                    storeId={props.storeId}
                    changeRootByItemClick={props.changeRootByItemClick}
                >
                    <GridViewForwarded
                        storeId={props.storeId}
                        ref={ref}
                        onItemClick={props.onItemClick}
                    />
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
