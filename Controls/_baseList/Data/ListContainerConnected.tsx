/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListState, ListSlice } from 'Controls/dataFactory';
import * as React from 'react';

import { error } from 'Controls/dataSource';
import { useSelector, useStrictSliceActions } from 'Controls-DataEnv/context';
import { INewListSchemeHandlers } from './INewListScheme';
import { useHandlersNew } from './connector/useHandlersNew';
import { useHandlersOld } from 'Controls/_baseList/Data/connector/useHandlersOld';
import { IConnectorProps } from './connector/interface/IConectorProps';
import { useOptionsValidator } from './connector/useOptionsValidator';
import CONSUMING_PROPS from './connector/contstants/ConsumingProps';
import { RegisterClass } from 'Controls/event';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';

const ErrorContainer = error.Container as unknown as React.FunctionComponent<
    React.PropsWithRef<error.IErrorContainerOptions> & {
        forwardedRef?: React.Ref<unknown>;
    }
>;

const onMouseEnterHandler = () => {
    if (!isLoaded('Controls/listWebReducers')) {
        loadAsync('Controls/listWebReducers');
    }
};

type TListStateKeysList = (keyof IListState)[];

// Список имён состояний слайса, которые используются здесь (в отличие от CONSUMING_PROPS, которые прокидываются пропсами в контент).
const LIST_STATE_NAMES = [
    'expanderVisibility',
    'collectionType',
    'columns',
    'header',
    'command',
    'errorViewConfig',
] as TListStateKeysList;

const Content = React.forwardRef<unknown>(function (
    props: {
        innerRef: React.ForwardedRef<unknown>;
        innerProps: IConnectorProps;
        innerChildren: IConnectorProps['children'];
    },
    ref: React.ForwardedRef<unknown>
) {
    const consumingState = props.consumingState;
    const listState = props.listState;
    const innerProps = props.innerProps;
    const eventHandlers = { ...props.eventHandlers };

    // если регистрировать onListSelectedKeysCountChanged как событие на wasaby-контроле
    // то будет происходить его множесвенный выхов из Controls/_baseTree/BaseTreeControl::_endBeforeUpdate()
    const listSelectedKeysCountChangedCallback = eventHandlers.onListSelectedKeysCountChanged;
    delete eventHandlers.onListSelectedKeysCountChanged;

    return React.cloneElement(props.innerContent, {
        ...innerProps,
        ...eventHandlers,
        listSelectedKeysCountChangedCallback,
        ...consumingState,

        // FIXME: Разобрать эти опции, сейчас тут хаос
        columns: listState.columns || innerProps.columns,
        header: listState.header || innerProps.header,
        // expanderVisibility - чисто интерфейсная опция, её не должно быть в слайсе.
        expanderVisibility: innerProps.expanderVisibility || listState.expanderVisibility,
        slice: props.slice,
        hasSlice: !!props.slice,
        // Коллекция создана на слайсе, проставлен коллекшн тайп.
        useCollection: !!listState.collectionType,
        collection: listState.collectionType ? props.slice.collection : props.collection,

        $wasabyRef: ref,
        ref,
        forwardedRef: props.forwardedRef,
        onMouseEnter: onMouseEnterHandler,
    });
});

function useListSliceState(storeId: string, stateNames: TListStateKeysList): Partial<IListState> {
    const memoizedSelector = React.useCallback(
        (state) => {
            const listState = state?.[storeId];
            if (!listState) {
                return {};
            }
            return stateNames.reduce(
                (all, name) => {
                    all[name] = listState[name];
                    return all;
                },
                {} as Record<string, unknown>
            ) as Partial<IListState>;
        },
        [storeId, stateNames]
    );
    return useSelector<unknown, Partial<IListState>>(memoizedSelector);
}

const ListContainerConnected = React.forwardRef(function (
    props: IConnectorProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    // Валидация опций, которые должны быть заданы на слайсе, но заданы на публичном контроле.
    useOptionsValidator(props);

    // Слайс списка
    const slice = useStrictSliceActions<ListSlice>(props.storeId);
    const consumingState = useListSliceState(props.storeId, CONSUMING_PROPS as TListStateKeysList);
    const listState = useListSliceState(props.storeId, LIST_STATE_NAMES);

    // Контекст, необходимые для обработчиков событий ItemActions
    const context = React.useMemo(() => ({ [props.storeId]: slice }), [props.storeId, slice]);

    // Средство исполнения команд списка.
    // TODO: Должны ли команды исполняться здесь?
    const selectedTypeRegister = React.useMemo(
        () =>
            new RegisterClass({
                register: 'selectedTypeChanged',
            }),
        []
    );

    // legacy API списка, обработчики событий.
    // FIXME: Должно быть удалено.
    //  Запрещено в них что то добавлять, обогащать можно только новое API(newApiEventHandlers).
    const oldApiEventHandlers = useHandlersOld({
        storeId: props.storeId,
        slice,
        changeRootByItemClick: props.changeRootByItemClick,
        selectedTypeRegister,
    });

    // Новое API списка, обработчики событий.
    const newApiEventHandlers = useHandlersNew({
        storeId: props.storeId,
        slice,
        changeRootByItemClick: props.changeRootByItemClick,
        context,
    });

    // Комбинированное API списка.
    // TODO: Удалить, оставив только новое API.
    const eventHandlers = React.useMemo<INewListSchemeHandlers>(() => {
        return {
            ...oldApiEventHandlers,
            ...newApiEventHandlers,
        };
    }, [oldApiEventHandlers, newApiEventHandlers]);

    // Исполнение команд
    // TODO: Должны ли команды исполняться здесь?
    React.useEffect(() => {
        if (listState.command) {
            selectedTypeRegister.start(listState.command);
            slice.onExecutedCommand();
        }
    }, [listState.command, slice, selectedTypeRegister]);

    // Установка соединения со слайсом.
    React.useEffect(() => {
        slice.connect();
        return () => {
            slice.disconnect();
        };
    }, [slice]);

    return (
        // FIXME: У коннектора нет ответственности компановать составные части, соответственно,
        //  использование ErrorContainer должно находиться уровнем ниже.
        // FIXME: Разобраться с таким костыльным способом оборачивать контент.
        <ErrorContainer viewConfig={listState.errorViewConfig} forwardedRef={ref}>
            <Content
                eventHandlers={eventHandlers}
                slice={slice}
                consumingState={consumingState}
                listState={listState}
                innerContent={props.children}
                className={props.className}
                innerProps={props}
            />
        </ErrorContainer>
    );
});

ListContainerConnected.defaultProps = {
    preloadRoot: true,
};
ListContainerConnected.displayName = 'Controls/baseList:ListContainerConnected';

export default ListContainerConnected;
