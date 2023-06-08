import { TInternalProps } from 'UICore/Executor';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { default as ContentTemplate } from './_ContentTemplate';
import { IContentTemplateOptions } from './_ContentTemplate';
import { TFontColorStyle } from 'Controls/interface';
import * as React from 'react';
import * as rk from 'i18n!Controls';
import { Logger } from 'UI/Utils';

const COLORS: TFontColorStyle[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'unaccented',
    'link',
    'label',
    'info',
    'default',
];

export interface IItemTemplateOptions extends TInternalProps {
    isSingleItem?: boolean;
    readOnly?: boolean;
    itemsLayout?: string;
    inlineHeight?: string;
    contentTemplate?: string | TemplateFunction;
    item: Model;
    size?: string;
    fontColorStyle?: string;
    className?: string;
    style?: object;
    tooltip?: string;
    clickable?: boolean;
    displayProperty?: string;
    caption?: string;
    theme?: string;
    crossTemplate?: string | TemplateFunction;
    crossTemplateDefault?: string | TemplateFunction;
    isLastItem?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    fontWeight?: string;
}

export function CrossTemplate(props: IItemTemplateOptions): JSX.Element {
    if (props.readOnly || props.crossTemplate === null) {
        return null;
    }
    if (props.crossTemplate) {
        return (
            <props.crossTemplate
                className={`controls-SelectedCollection__item__caption-${props.itemsLayout}`}
                theme={props.theme}
                onClick={props.onClick}
            />
        );
    } else {
        return (
            <div
                className={`js-controls-SelectedCollection__item__cross 
                             controls-SelectedCollection__item__caption-${props.itemsLayout}
                             icon-CloseNew controls-SelectedCollection__item__cross ws-disableFastTouch`}
                title={rk('Удалить')}
                data-qa="SelectedCollection__item__cross"
                onClick={props.onClick}
            ></div>
        );
    }
}

function ItemTemplate(
    props: IItemTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const style = typeof props.style === 'object' ? props.style : props.attrs?.style;
    let fontWeight = props.fontWeight;
    let fontColorStyle = props.fontColorStyle;

    if (!fontWeight && typeof props.style === 'string' && props.style === 'bold') {
        fontWeight = props.style;
        Logger.error(
            "Насыщенность шрифта для 'Controls/lookup:ItemTemplate' необходимо " +
                'задавать через опцию fontWeight'
        );
    }

    if (!fontColorStyle && typeof props.style === 'string' && COLORS.includes(props.style)) {
        fontColorStyle = props.style;
        Logger.error(
            "Стиль цвета текста для 'Controls/lookup:ItemTemplate' необходимо " +
                'задавать через опцию fontColorStyle'
        );
    }

    const contentProps: Partial<IContentTemplateOptions> = {
        item: props.item,
        size: props.itemsLayout === 'twoColumns' || !props.size ? 'default' : props.size,
        fontColorStyle:
            props.itemsLayout === 'twoColumns' || !fontColorStyle ? 'default' : fontColorStyle,
        tooltip: props.tooltip,
        clickable: props.clickable,
        displayProperty: props.displayProperty,
        caption: props.caption,
        theme: props.theme,
        fontWeight,
    };
    if (props.onClick) {
        contentProps.onClick = props.onClick;
    }

    return (
        <div
            className={`controls-SelectedCollection__item ${
                props.attrs?.className || props.className
            }
                        controls-SelectedCollection__item-${props.isSingleItem ? 'single' : 'multi'}
                        ${
                            props.readOnly
                                ? 'controls-SelectedCollection__item-' +
                                  (props.isSingleItem ? 'single' : 'multi') +
                                  '-readOnly'
                                : ''
                        }
                        controls-SelectedCollection__item_layout_${props.itemsLayout}`}
            ref={ref}
            style={style}
            data-qa={props.attrs?.['data-qa'] || props['data-qa']}
        >
            <span
                className={`controls-SelectedCollection__item__caption-wrapper
                             ${
                                 props.inlineHeight
                                     ? 'controls-SelectedCollection__item__caption-wrapper_lineheight-' +
                                       props.inlineHeight
                                     : props.itemsLayout === 'default'
                                     ? 'controls-SelectedCollection__item__caption-wrapper_lineheight-default'
                                     : ''
                             }`}
            >
                <props.contentTemplate {...contentProps} />
            </span>
            <CrossTemplate {...props} />
            {props.readOnly && !props.isLastItem && props.itemsLayout !== 'twoColumns' ? (
                <span
                    className={`controls-text-${
                        props.itemsLayout === 'twoColumns' || !fontColorStyle
                            ? 'default'
                            : fontColorStyle
                    }`}
                >
                    ,
                </span>
            ) : (
                ''
            )}
        </div>
    );
}

const forwardedComponent = React.forwardRef(ItemTemplate);

forwardedComponent.defaultProps = {
    contentTemplate: ContentTemplate,
};

export default forwardedComponent;
