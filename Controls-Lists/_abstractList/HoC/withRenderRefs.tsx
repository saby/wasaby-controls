/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ComponentType, forwardRef, MutableRefObject, useImperativeHandle, useRef } from 'react';
import { IAbstractListScrollAPI } from '../interface/IAbstractComponentAPI';

/**
 * Ссылки(React.Ref) на DOM элементы, которые могут понадобится в различных функциональностях списка.
 */
export type TWithRenderRefsProvidedProps = {
    /**
     * Ссылка на корневой элемент компонента.
     */
    listContainerRef: MutableRefObject<HTMLDivElement | null>;

    /**
     * Ссылка на корневой элемент Render'a списка.
     */
    renderContainerRef: MutableRefObject<HTMLDivElement | null>;

    /**
     * API скролла в списке.
     */
    scrollAPIRef: MutableRefObject<IAbstractListScrollAPI | undefined>;
};

/**
 * Обертка поставляет ссылки(React.Ref) на DOM элементы, которые могут понадобится в различных функциональностях списка.
 * Обертка не имплементирует ссылки, эта ответстенность лежит на вложенных компонентах.
 * @param Component Оборачиваемый компонент.
 */
export function withRenderRefs<TOuter>(
    Component: ComponentType<TOuter & TWithRenderRefsProvidedProps>
) {
    const Composed = forwardRef<IAbstractListScrollAPI, TOuter>((props: TOuter, ref) => {
        const listContainerRef = useRef<HTMLDivElement | null>(null);
        const renderContainerRef = useRef<HTMLDivElement | null>(null);

        const scrollAPIRef = useRef<IAbstractListScrollAPI>({
            scrollToItem() {},
        });

        useImperativeHandle(ref, () => ({
            scrollToItem: scrollAPIRef.current.scrollToItem,
        }));

        return (
            <Component
                {...props}
                scrollAPIRef={scrollAPIRef}
                listContainerRef={listContainerRef}
                renderContainerRef={renderContainerRef}
            />
        );
    });

    Composed.displayName = `withRenderRefs(${Component.displayName || Component.name})`;

    return Composed;
}

export default withRenderRefs;
