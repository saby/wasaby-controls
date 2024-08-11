import { default as ItemTemplate, IItemTemplateProps } from './itemTemplate';

export interface IItemCounterTemplateProps extends IItemTemplateProps {
    counterProperty?: string;
    counterStyle?: string;
}

/**
 * Шаблон для отображения счетчика для компонента "Чипсы"
 * @param props
 */
export default function itemCounterTemplate(props: IItemTemplateProps) {
    return (
        <>
            <ItemTemplate
                {...props}
                item={props.item}
                fontSize={props.fontSize}
                displayProperty={props.displayProperty}
                selected={props.selected}
                className={props.className}
            />
            {props.item.get(props.counterProperty || 'counter') ? (
                <span
                    className={
                        (props.caption ||
                        props.item.get(props.displayProperty || 'title') ||
                        props.item.get('caption')
                            ? 'controls-margin_left-2xs '
                            : '') +
                        'controls-ButtonGroup__button-counter' +
                        (props.counterStyle && !props.selected
                            ? ' controls-text-' + props.counterStyle
                            : ` controls-text-${props.fontColorStyle}`)
                    }
                >
                    {props.item.get(props.counterProperty || 'counter')}
                </span>
            ) : null}
        </>
    );
}
