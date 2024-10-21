import type { TInternalProps } from 'UICore/Executor';
import { delimitProps } from 'UICore/Jsx';

interface ICompatibleReactProps extends Pick<TInternalProps, 'attrs'> {
    className?: string;
}

export function getUserClassName(props: ICompatibleReactProps): string {
    const { userAttrs } = delimitProps(props);
    return `${userAttrs?.className || ''} ${props.className || ''}`.trim();
}
