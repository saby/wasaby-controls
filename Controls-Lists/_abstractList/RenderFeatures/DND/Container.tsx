/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { useStableCallback, useStableCallbackSafe } from 'Controls/hooks';

import type { dndCore } from 'Controls/listDragNDropNew';
import { __notifyFromReact } from 'UI/Events';
import { Guid } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

interface IDndContext extends Pick<dndCore.IDragNDropAPI, 'tryStart'> {
    move(event: dndCore.TEvent, key: CrudEntityKey): void;
}
const DndContext = React.createContext<IDndContext | undefined>(undefined);

export function useDndContext(): IDndContext | undefined {
    return React.useContext(DndContext);
}

const getDndCore = async (
    cb: (core: (typeof import('Controls/listDragNDropNew'))['dndCore']) => void
) => {
    const libPath = 'Controls/listDragNDropNew';
    const core = (
        isLoaded(libPath)
            ? loadSync<typeof import('Controls/listDragNDropNew')>(libPath)
            : await loadAsync<typeof import('Controls/listDragNDropNew')>(libPath)
    ).dndCore;
    cb(core);
};

type TDragNDropContainerProps = Omit<
    TDragNDropProviderProps,
    | 'register'
    | 'unregister'
    | 'dragControlId'
    | 'onDocumentDragStart'
    | 'onDocumentDragEnd'
    | 'updateDraggingRenderCallback'
>;

type TDragNDropProviderProps = dndCore.IDragNDropProps & {
    children: JSX.Element;
    listContainerRef: TContainerRef;
};

type TContainerRef = React.MutableRefObject<HTMLElement | null>;

type TRegistrarProvidedProps = Pick<
    TDragNDropProviderProps,
    'register' | 'unregister' | 'dragControlId'
> & {
    notifyWithBubbling(eventName: string, args: unknown[]): void;
};

const DragNDropContainer = withDragNDropRegistrar<TDragNDropContainerProps>((props) => {
    const { notifyWithBubbling } = props;

    const onDocumentDragStart = useStableCallback<TDragNDropProviderProps['onDocumentDragStart']>(
        (dragObject) => {
            notifyWithBubbling('_documentDragStart', [dragObject]);
        },
        [notifyWithBubbling]
    );

    const onDocumentDragEnd = useStableCallback<TDragNDropProviderProps['onDocumentDragEnd']>(
        (dragObject) => {
            notifyWithBubbling('_documentDragEnd', [dragObject]);
        },
        [notifyWithBubbling]
    );

    const updateDraggingRenderCallback = useStableCallback<
        TDragNDropProviderProps['updateDraggingRenderCallback']
    >(
        (dragObject, draggingRender) => {
            notifyWithBubbling('_updateDraggingTemplate', [dragObject, draggingRender]);
        },
        [notifyWithBubbling]
    );

    return (
        <DragNDropProvider
            {...props}
            children={props.children}
            onDocumentDragStart={onDocumentDragStart}
            onDocumentDragEnd={onDocumentDragEnd}
            updateDraggingRenderCallback={updateDraggingRenderCallback}
        />
    );
});

const EMPTY_FN = () => {};
const EMPTY_OBJ = {};

function DragNDropProvider(props: TDragNDropProviderProps) {
    const dndState = React.useMemo<dndCore.TState>(
        () => ({ insideDragging: false, isDocumentDragging: false }),
        []
    );

    const apiRef = React.useRef<dndCore.IDragNDropAPI>({
        tryStart: EMPTY_FN,
        move: EMPTY_FN,
        end: EMPTY_FN,
    });

    React.useLayoutEffect(() => {
        const documentDragStartHandler = (dragObject: dndCore.TDragObject) => {
            getDndCore((core) => {
                core.onDocumentDragStart(dndState, props, dragObject);
            });
        };
        const documentDragEndHandler = (dragObject: dndCore.TDragObject) => {
            getDndCore((core) => {
                core.onDocumentDragEnd(dndState, props, dragObject);
            });
        };
        // TODO: Список может замаунтится уже во время ДнД.
        //  Чтобы узнать о ДнД получаем dragObject из события.
        //  Надо перенести это из BaseControl.
        props.register?.('documentDragStart', documentDragStartHandler);
        props.register?.('documentDragEnd', documentDragEndHandler);

        return () => {
            props.unregister?.('documentDragStart');
            props.unregister?.('documentDragEnd');
        };
    }, [dndState, props]);

    const tryStart = useStableCallback<dndCore.IDragNDropAPI['tryStart']>(
        (event, draggableKey) => {
            getDndCore((core) => {
                core.tryStart(dndState, props, event, draggableKey, apiRef.current);
            });
        },
        [dndState, props]
    );
    const moveOnItem = useStableCallback<IDndContext['move']>(
        (event, targetKey) => {
            getDndCore((core) => {
                core.moveOnItem(dndState, props, event, targetKey);
            });
        },
        [dndState, props]
    );

    apiRef.current.move = useStableCallbackSafe(
        (event) => {
            getDndCore((core) => {
                core.move(dndState, props, event);
            });
        },
        mouseOrTouchEventExtractor,
        [dndState, props]
    );

    apiRef.current.end = useStableCallbackSafe(
        (event) => {
            getDndCore((core) => {
                core.end(dndState, props, event);
            });
        },
        mouseOrTouchEventExtractor,
        [dndState, props]
    );

    const value = React.useMemo<IDndContext>(
        () => ({
            tryStart,
            move: moveOnItem,
        }),
        [moveOnItem, tryStart]
    );

    apiRef.current.tryStart = tryStart;

    // TODO: !!!!
    // const destroy = useStableCallback(React.useCallback(() => {}, []));

    return <DndContext.Provider value={value} children={props.children} />;
}

function withDragNDropRegistrar<
    TOuter extends {
        listContainerRef: TContainerRef;
    },
>(Component: React.FunctionComponent<TOuter & TRegistrarProvidedProps>) {
    function Composed(props: TOuter) {
        const id = React.useMemo(() => Guid.create(), []);

        const notify = useStableCallback(
            (eventName: string, args: unknown[], bubbling: boolean) => {
                __notifyFromReact(props.listContainerRef.current, eventName, args, bubbling);
            }
        );

        const register = useStableCallback(
            (eventName: string, handler: Function): void => {
                notify('register', [eventName, EMPTY_OBJ, handler, { id }], true);
            },
            [id, notify]
        );

        const unregister = useStableCallback(
            (eventName: string): void => {
                notify('unregister', [eventName, EMPTY_OBJ, { id }], true);
            },
            [id, notify]
        );

        const notifyWithBubbling = useStableCallback(
            (eventName: string, args: unknown[]): void => {
                notify(eventName, args, true);
            },
            [notify]
        );

        return (
            <Component
                {...props}
                dragControlId={id}
                register={register}
                unregister={unregister}
                notifyWithBubbling={notifyWithBubbling}
            />
        );
    }

    Composed.displayName = `withDragNDropRegistrar(${Component.displayName || Component.name})`;

    return Composed;
}

function mouseOrTouchEventExtractor(
    ...args: unknown[]
): undefined | [event: MouseEvent | TouchEvent] {
    const e = args[0];

    const check = (obj: unknown): obj is MouseEvent | TouchEvent =>
        !!obj && (obj instanceof MouseEvent || obj instanceof TouchEvent);

    if (!e) {
        return;
    } else if (check(e)) {
        return [e];
    }

    const native = (e as { nativeEvent: MouseEvent | TouchEvent }).nativeEvent;

    if (!native) {
        return;
    } else if (check(native)) {
        return [native];
    }
}

export { DragNDropContainer, TDragNDropContainerProps };
export default DragNDropContainer;
