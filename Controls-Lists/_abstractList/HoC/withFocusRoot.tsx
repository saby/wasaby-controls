/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { FocusRoot } from 'UI/Focus';
import type { ComponentType } from 'react';
import type { IComponentPropsWithReadonly } from 'Controls/interface';
import type { TWithRenderRefsProvidedProps } from './withRenderRefs';
import { logger } from 'Application/Env';

/**
 * Опции компонента, обернутог в HOC withFocusRoot.
 * @see withFocusRoot
 */
type TWithFocusRootOwnProps = Pick<IComponentPropsWithReadonly, 'dataQa' | 'style' | 'className'> &
    TWithRenderRefsProvidedProps;

/**
 * HOC подключающий компонент к системе фокусов.
 * ВНИМАНИЕ! Данная обертка родит div!
 * @param Component Оборачиваемый компонент.
 */
export function withFocusRoot<TOuter>(Component: ComponentType<TOuter>) {
    function Composed(props: TOuter & TWithFocusRootOwnProps) {
        const { className, dataQa, style, ...cleanProps } = props;

        const qa = dataQa || props['data-qa' as keyof typeof props];

        if (props['data-qa' as keyof typeof props]) {
            logger.warn(
                'ПРИКЛАДНАЯ ОШИБКА использовния легковесного списка Controls-Lists/abstractList!\n' +
                    `Задана неизвестная опция data-qa="${
                        props['data-qa' as keyof typeof props]
                    }".\n` +
                    'Опция устарела и не будет больше поддерживаться!\n' +
                    'Используйте опцию dataQa!'
            );
        }

        return (
            <FocusRoot
                as="div"
                className={className}
                style={style}
                data-qa={qa}
                autofocus={true}
                ref={props.listContainerRef}
            >
                <Component {...(cleanProps as TOuter)} data-qa={undefined} />
            </FocusRoot>
        );
    }

    Composed.displayName = `withFocusRoot(${Component.displayName || Component.name})`;

    return Composed;
}

export default withFocusRoot;
