import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';

/**
 * Обертка, позволяющая получить контекст индикатора
 * @class Controls/_LoadingIndicator/ContextConsumer
 * @public
 * @remark Отдает в контент стандартные методы индикатора:
 * * showIndicator
 * * hideIndicator
 */

export default function ContextConsumer(props: TInternalProps) {
    const context = useContext(Context);

    return (
        <>
            {cloneElement(props.children, {
                ...this.props,
                showIndicator: context.showIndicator,
                hideIndicator: context.hideIndicator,
            })}
        </>
    );
}
