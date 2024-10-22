import * as React from 'react';
import { KeyHook } from 'UI/HotKeys';
import { constants } from 'Env/Env';
import { helpers } from 'Controls/listsCommonLogic';
import { SyntheticEvent } from 'UICommon/Events';
import { IListContainerHandlersConverterProps } from './ListContainerHandlersConverter';

function HotKeysContainer(
    {
        onViewKeyDownArrowUpNew,
        onViewKeyDownArrowDownNew,
        onViewKeyDownArrowLeftNew,
        onViewKeyDownArrowRightNew,
        onViewKeyDownDelNew,
        onViewKeyDownSpaceNew,
        onItemKeyDownEnterNew,
        children,
    }: IListContainerHandlersConverterProps & { children: JSX.Element },
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const _defaultActions = [
        { keyCode: constants.key.up },
        { keyCode: constants.key.down },
        { keyCode: constants.key.left },
        { keyCode: constants.key.right },
        { keyCode: constants.key.space },
        { keyCode: constants.key.enter },
        { keyCode: constants.key.del },
    ];
    const handlers = {
        [constants.key.up]: onViewKeyDownArrowUpNew,
        [constants.key.down]: onViewKeyDownArrowDownNew,
        [constants.key.left]: onViewKeyDownArrowLeftNew,
        [constants.key.right]: onViewKeyDownArrowRightNew,
        [constants.key.space]: onViewKeyDownSpaceNew,
        [constants.key.enter]: onItemKeyDownEnterNew,
        [constants.key.del]: onViewKeyDownDelNew,
    };

    const _keyDown = (event: SyntheticEvent<KeyboardEvent>): void => {
        const hotKeys = _defaultActions.map((e) => {
            return e.keyCode;
        });
        if (hotKeys.includes(event.nativeEvent.keyCode)) {
            helpers.events.parseViewKeyDown(event, handlers);
            event.stopPropagation();
        }
    };

    return (
        <KeyHook defaultActions={_defaultActions} context="global">
            {React.cloneElement(children, {
                onKeyDown: _keyDown,
                ref,
            })}
        </KeyHook>
    );
}

export default React.memo(React.forwardRef(HotKeysContainer));
