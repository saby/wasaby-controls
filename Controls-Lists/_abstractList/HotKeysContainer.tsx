/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { KeyHook } from 'UI/HotKeys';
import { constants } from 'Env/Env';
import { helpers } from 'Controls/listsCommonLogic';

const DEFAULT_ACTIONS = [
    { keyCode: constants.key.up },
    { keyCode: constants.key.down },
    { keyCode: constants.key.left },
    { keyCode: constants.key.right },
    { keyCode: constants.key.space },
    { keyCode: constants.key.enter },
    { keyCode: constants.key.del },
];

const getHandlers = (props: THotKeysContainerProps) => ({
    [constants.key.up]: props.onViewKeyDownArrowUp,
    [constants.key.down]: props.onViewKeyDownArrowDown,
    [constants.key.left]: props.onViewKeyDownArrowLeft,
    [constants.key.right]: props.onViewKeyDownArrowRight,
    [constants.key.space]: props.onViewKeyDownSpace,
    [constants.key.enter]: props.onViewKeyDownEnter,
    [constants.key.del]: props.onViewKeyDownDel,
});

type THotKeysContainerProps = {
    onViewKeyDownArrowUp?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownArrowDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownArrowLeft?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownArrowRight?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownDel?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownSpace?: React.KeyboardEventHandler<HTMLDivElement>;
    onViewKeyDownEnter?: React.KeyboardEventHandler<HTMLDivElement>;
} & { children: React.JSX.Element };

export const HotKeysContainer = React.memo(
    React.forwardRef(function HotKeysContainer(
        props: THotKeysContainerProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ) {
        const handlers = React.useRef(getHandlers(props));

        React.useEffect(() => {
            handlers.current = getHandlers(props);
        }, [props]);

        const _keyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>): void => {
                const hotKeys = DEFAULT_ACTIONS.map((e) => {
                    return e.keyCode;
                });
                if (hotKeys.includes(event.nativeEvent.keyCode)) {
                    helpers.events.parseViewKeyDown(event, handlers.current);
                    event.stopPropagation();
                }
            },
            [handlers]
        );

        return (
            <KeyHook defaultActions={DEFAULT_ACTIONS} context="global">
                {React.cloneElement(props.children, {
                    onKeyDown: _keyDown,
                    ref,
                })}
            </KeyHook>
        );
    })
);
