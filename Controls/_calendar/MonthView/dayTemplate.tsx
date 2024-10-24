/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import MonthViewModel from './MonthViewModel';

interface IDayTemplateProps {
    monthViewModel: MonthViewModel;
    contentTemplate?: JSX.Element;
    value: object;
    attrs?: object;
    newMode: boolean;
    sizeStyle?: string;
    fontColorStyle: string;
    backgroundStyle: string;
    borderStyle: string;
    fontWeight: string;

    onClick?: Function;
    onKeyDown?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
}

export default React.forwardRef(function DayTemplate(
    props: IDayTemplateProps,
    ref: React.Ref<HTMLDivElement>
): React.ReactElement {
    const attrs = props.attrs || {};
    const contentTemplate = !!props.contentTemplate ? (
        <props.contentTemplate value={props.value} />
    ) : (
        props.value.day
    );

    if (props.newMode !== true) {
        if (props.value.clickable) {
            return (
                <>
                    {!!props.value.today && (
                        <div
                            className={`controls-MonthViewVDOM__item-today-background_style-${
                                props.sizeStyle || 'default'
                            }`}
                        ></div>
                    )}
                    {contentTemplate}
                </>
            );
        } else {
            return null;
        }
    }

    const preparedClass = props.monthViewModel._prepareClass(
        props.value,
        props.fontColorStyle,
        props.backgroundStyle,
        props.borderStyle,
        props.fontWeight,
        props.selectionStyle,
        props.counterProperty
    );
    const dataQA =
        (props.attrs && props.attrs['data-qa']) ||
        (!!props.value.selected && 'controls-MonthViewVDOM__item-selected') ||
        null;

    return (
        <div
            // tabIndex={-1} позволяет нативно получать фокус по клику и не получать фокус по табу.
            tabIndex={-1}
            {...attrs}
            as="div"
            ref={ref}
            date={props.date}
            data-qa={dataQA}
            data-date={props.value.id}
            className={
                `controls-MonthViewVDOM__item controls-MonthViewVDOM__item_style-${
                    props.sizeStyle || 'default'
                }` + ` ${preparedClass} ${attrs.className || props.className || ''}`
            }
            onClick={props.onClick}
            onKeyDown={props.onKeyDown}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
        >
            {!!props.value.clickable && (
                <>
                    {!!props.value.today && (
                        <div
                            className={
                                'controls-MonthViewVDOM__item-today-background' +
                                ` controls-MonthViewVDOM__item-today-background_style-${
                                    props.sizeStyle || 'default'
                                }`
                            }
                        ></div>
                    )}
                    {contentTemplate}
                </>
            )}
        </div>
    );
});
