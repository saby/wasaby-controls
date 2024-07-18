import { ExpanderComponent, getExpanderProps } from 'Controls/baseTree';
import { useExpanderState } from 'Controls/_treeGrid/hooks/useExpanderState';
import { IBaseExpanderProps } from 'Controls/_baseTree/render/ExpanderComponent';

export function ExpanderConnectedComponent(props: IBaseExpanderProps) {
    const { item, expanded } = useExpanderState();
    return <ExpanderComponent {...getExpanderProps(props, item)} expanded={expanded} />;
}
