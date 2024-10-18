/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListSlice } from 'Controls/dataFactory';
import * as React from 'react';

import { error } from 'Controls/dataSource';
import { DataContext, useSlice } from 'Controls-DataEnv/context';
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

const Content = React.forwardRef<unknown>(function (
    props: {
        innerRef: React.ForwardedRef<unknown>;
        innerProps: IConnectorProps;
        innerChildren: IConnectorProps['children'];
    },
    ref: React.ForwardedRef<unknown>
) {
    const state = props.slice.state;
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

        // FIXME: Убрать каст
        ...CONSUMING_PROPS.reduce(
            (all, name) => {
                all[name] = state[name];
                return all;
            },
            {} as Record<string, unknown>
        ),

        // FIXME: Разобрать эти опции, сейчас тут хаос
        columns: state.columns || innerProps.columns,
        header: state.header || innerProps.header,
        // expanderVisibility - чисто интерфейсная опция, её не должно быть в слайсе.
        expanderVisibility: innerProps.expanderVisibility || state.expanderVisibility,
        slice: props.slice,
        hasSlice: !!props.slice,
        // Коллекция создана на слайсе, проставлен коллекшн тайп.
        useCollection: !!state.collectionType,
        collection: state.collectionType ? props.slice._collection : props.collection,

        $wasabyRef: ref,
        ref,
        forwardedRef: props.forwardedRef,
        onMouseEnter: onMouseEnterHandler,
    });
});

const ListContainerConnected = React.forwardRef(function (
    props: IConnectorProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    // Валидация опций, которые должны быть заданы на слайсе, но заданы на публичном контроле.
    useOptionsValidator(props);

    // Контекст, необходимые для обработчиков событий ItemActions
    const context = React.useContext(DataContext);

    // Слайс списка
    const slice = useSlice(props.storeId) as ListSlice;

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
        context,
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
        if (slice.state.command) {
            selectedTypeRegister.start(slice.state.command);
            slice.onExecutedCommand();
        }
    }, [slice.state.command]);

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
        <ErrorContainer viewConfig={slice.state.errorViewConfig} forwardedRef={ref}>
            <Content
                eventHandlers={eventHandlers}
                slice={slice}
                innerContent={props.children}
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
