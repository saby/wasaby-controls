/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    ComponentType,
    createContext,
    KeyboardEvent,
    KeyboardEventHandler,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { KeyHook } from 'UI/HotKeys';
import { constants } from 'Env/Env';
import { helpers } from 'Controls/listsCommonLogic';

const { key } = constants;

const DEFAULT_KEYS = [
    key.up,
    key.down,
    key.left,
    key.right,
    key.space,
    key.enter,
    key.del,
    key.backspace,
] as const;

const DEFAULT_ACTIONS = DEFAULT_KEYS.map((keyCode) => ({
    keyCode,
}));

type TKeyEvent = KeyboardEvent<HTMLDivElement>;
type TKeyHandler = KeyboardEventHandler<HTMLDivElement>;

type THotKeysHandlers = {
    onArrowUp?: TKeyHandler;
    onArrowDown?: TKeyHandler;
    onArrowLeft?: TKeyHandler;
    onArrowRight?: TKeyHandler;
    onDel?: TKeyHandler;
    onSpace?: TKeyHandler;
    onEnter?: TKeyHandler;
    onBackSpace?: TKeyHandler;
};

interface IHotKeysRenderContext {
    onKeyDown(event: TKeyEvent): void;
}

const HotKeysContext = createContext<IHotKeysRenderContext>({
    onKeyDown() {},
});

/**
 * HOC подключающий компонент к системе горячих клавиш.
 * @param Component Оборачиваемый компонент.
 */
export function withHotKeysListener<TOuter>(Component: ComponentType<TOuter>) {
    function Composed(props: TOuter & THotKeysHandlers) {
        const {
            onArrowUp,
            onArrowLeft,
            onArrowRight,
            onArrowDown,
            onEnter,
            onSpace,
            onBackSpace,
            onDel,
            ...clearProps
        } = props;
        const handlers = useRef(getHandlers(props));

        useEffect(() => {
            handlers.current = getHandlers(props);
        }, [props]);

        const value = useMemo<IHotKeysRenderContext>(
            () => ({
                onKeyDown: (event): void => {
                    const hotKeys = DEFAULT_ACTIONS.map((e) => e.keyCode);
                    if (hotKeys.includes(event.nativeEvent.keyCode)) {
                        helpers.events.parseViewKeyDown(event, handlers.current);
                        event.stopPropagation();
                    }
                },
            }),
            []
        );

        return (
            <KeyHook defaultActions={DEFAULT_ACTIONS} context="global">
                <HotKeysContext.Provider value={value}>
                    <Component {...(clearProps as unknown as any)} />
                </HotKeysContext.Provider>
            </KeyHook>
        );
    }

    Composed.displayName = `withHotKeysListener(${Component.displayName || Component.name})`;

    return Composed;
}

const getHandlers = (props: THotKeysHandlers) => ({
    [key.up]: props.onArrowUp,
    [key.down]: props.onArrowDown,
    [key.left]: props.onArrowLeft,
    [key.right]: props.onArrowRight,
    [key.space]: props.onSpace,
    [key.enter]: props.onEnter,
    [key.del]: props.onDel,
    [key.backspace]: props.onBackSpace,
});

export default withHotKeysListener;
