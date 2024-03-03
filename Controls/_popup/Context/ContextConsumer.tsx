import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';

/**
 * Обертка, позволяющая получить контекст окон
 * @class Controls/_popup/ContextConsumer
 * @public
 * @remark Отдает в контент стандартные методы окон:
 * * close
 * * sendResult
 */
export default function ContextConsumer(props: TInternalProps) {
    const context = useContext(Context);

    return (
        <>
            {cloneElement(props.children, {
                ...props,
                sendResult: context?.sendResult,
                close: context?.close,
                maximized: context?.maximized,
            })}
        </>
    );
}
