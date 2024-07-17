/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { ExpanderComponent, getExpanderProps } from 'Controls/baseTree';
import { useExpanderState } from 'Controls/_treeGrid/hooks/useExpanderState';
import { IExpanderProps } from 'Controls/baseTree';

export function ExpanderConnectedComponent(props: IExpanderProps) {
    const { item, expanded } = useExpanderState();
    return <ExpanderComponent {...getExpanderProps(props, item)} expanded={expanded} />;
}

/**
 * Компонент "Экспанде узла".
 * При размещении в пользовательском рендере ячейки позволяет разворачивать и сворачивать узел.
 * Управление узлом дерева происходит через контекст строки, распространяемый Controls/gridReact.
 * Подробнее про Controls/gridReact читайте в документации {@link https://online.sbis.ru/article/react-lists Реакт-подход к рендеру таблиц}
 * @class Controls/_treeGrid/renderReact/ExpanderConnectedComponent
 * @implements Controls/_baseTree/render/ExpanderComponent/IExpanderProps
 * @public
 */
