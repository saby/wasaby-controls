/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { CrudEntityKey } from 'Types/source';
import { ActiveItemContext, IContextValue } from './ActiveItemContext';

interface IProps extends TInternalProps {
    activeElement: CrudEntityKey;
}

/**
 * Подписчик контекста с активным элементом для связки списка с оглавлением.
 * @param props
 * @constructor
 */
function ActiveItemContextConsumer(props: IProps): JSX.Element {
    const context = React.useContext(ActiveItemContext) as IContextValue;

    return (
        <>
            {React.cloneElement(props.children, {
                ...props,
                activeElement: context ? context.activeElement : props.activeElement,
                onActiveElementChanged: context?.onActiveElementChanged,
            })}
        </>
    );
}

export default React.memo(ActiveItemContextConsumer);
