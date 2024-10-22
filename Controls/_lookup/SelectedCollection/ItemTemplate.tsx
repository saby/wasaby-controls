import { TInternalProps } from 'UICore/Executor';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { default as ContentTemplate, IContentTemplateOptions } from './_ContentTemplate';
import { TFontColorStyle, TSelectionType } from 'Controls/interface';
import * as React from 'react';
import { useCallback } from 'react';
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
    underlineVisible?: boolean;
    multiLine?: boolean;
    multiLineViewMode: 'multiLine' | 'singleLine' | 'single-multiLine';
    parentProperty?: string;
    nodeProperty?: string;
    selectionType?: TSelectionType;
}

export function CrossTemplate(props: IItemTemplateOptions): JSX.Element {
    const clickCallback = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (props.onClick) {
                props.onClick(event);
            }
        },
        [props.onClick]
    );

    if (props.readOnly || props.crossTemplate === null) {
        return null;
    }

    if (props.crossTemplate) {
        return (
            <props.crossTemplate
                className={`
                    controls-SelectedCollection__item__caption-${props.itemsLayout}
                    ${
                        props.multiLineViewMode === 'single-multiLine'
                            ? 'controls-SelectedCollection__item__cross-multiLine'
                            : ''
                    }
                `}
                theme={props.theme}
                onClick={clickCallback}
            />
        );
    } else {
        return (
            <div
                className={`
                    js-controls-SelectedCollection__item__cross 
                    controls-SelectedCollection__item__caption-${props.itemsLayout}
                    ${
                        props.multiLineViewMode === 'single-multiLine'
                            ? 'controls-SelectedCollection__item__cross-multiLine'
                            : ''
                    }
                    icon-CloseNew controls-SelectedCollection__item__cross ws-disableFastTouch
                    ${props.className || ''}
                `}
                title={rk('Удалить')}
                data-qa="SelectedCollection__item__cross"
                onClick={clickCallback}
            ></div>
        );
    }
}

function ItemTemplate(
    props: IItemTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const style = typeof props.style === 'object' ? props.style : props.attrs?.style;
    const fontColorStyle = props.fontColorStyle;

    if (!props.item) {
        Logger.error(
            `Не передана обязательная опция item в шаблон элемента itemTemplate поля выбора (Controls/lookup).
            Если вы задаёте опцию itemTemplate для поля выбора, то 
            1) проверьте, что в корне используется базовый шаблон (Controls/lookup:ItemTemplate).
            2) до базового шаблона проксируются опции: <itemTemplate scope={{ itemTemplate }}/> в wasaby, и <itemTemplate {...props}/> в React`
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
        underlineVisible: props.underlineVisible,
        fontWeight: props.fontWeight,
        multiLine: props.multiLine,
        multiLineViewMode: props.multiLineViewMode,
        parentProperty: props.parentProperty,
        nodeProperty: props.nodeProperty,
        selectionType: props.selectionType,
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
                className={`
                    controls-SelectedCollection__item__caption-wrapper
                    ${
                        props.inlineHeight
                            ? 'controls-SelectedCollection__item__caption-wrapper_lineheight-' +
                              props.inlineHeight
                            : props.itemsLayout === 'default'
                            ? 'controls-SelectedCollection__item__caption-wrapper_lineheight-default'
                            : ''
                    }
                    ${
                        props.multiLine
                            ? 'controls-SelectedCollection__item__caption-wrapper--multiLine'
                            : ''
                    }
                `}
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
