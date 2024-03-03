/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import * as React from 'react';
import { Base as dateUtil } from 'Controls/dateUtils';
import { IntersectionObserverContainer } from 'Controls/scroll';
import { unsafe_getRootAdaptiveMode } from 'UICore/Adaptive';
import CalendarAddButton from 'Controls/_compactDatePicker/CalendarAddButton';

function CompactDatePickerDayContentTemplate(props) {
    const isSelectedStart = (): boolean => {
        if (props.rangeModel.startValue > props.rangeModel.endValue) {
            return false;
        }
        return (
            (props.value.selectionBase &&
                dateUtil.isDatesEqual(props.value.date, props.rangeModel.startValue)) ||
            (!props.value.selectionProcessing &&
                props.value.selectedStart &&
                (!dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue) ||
                    props.value.selectionProcessing))
        );
    };

    const isSelectedEnd = (): boolean => {
        if (props.rangeModel.startValue > props.rangeModel.endValue) {
            return false;
        }
        return (
            (props.value.selectionBase &&
                dateUtil.isDatesEqual(props.value.date, props.rangeModel.endValue) &&
                !dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue)) ||
            (!props.value.selectionProcessing &&
                props.value.selectedEnd &&
                !dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue))
        );
    };

    return (
        <>
            <div
                className={`controls-CompactDatePicker__month-list__item__container${
                    props.hasCounter
                        ? ' controls-CompactDatePicker__month-list__item__container_withCounter'
                        : ''
                }`}
            >
                {props.value.day}
                {props.hasCounter && (
                    <div
                        onClick={props.onCounterClick}
                        className="controls-CompactDatePicker__month-list__item__counter"
                    >
                        <div>
                            <div className="controls-CompactDatePicker__month-list__item__counter-icon">
                                <CalendarAddButton />
                            </div>
                            <div className="controls-CompactDatePicker__month-list__item__counter-caption ws-ellipsis">
                                {!!props.counter && props.counter}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isSelectedStart() ? (
                <div className="controls-CompactDatePicker__month-list__item_selected__container">
                    <div className="controls-CompactDatePicker__month-list__item_selected controls-CompactDatePicker__month-list__item_selected-start"></div>
                </div>
            ) : null}
            {isSelectedEnd() ? (
                <div className="controls-CompactDatePicker__month-list__item_selected__container">
                    <div className="controls-CompactDatePicker__month-list__item_selected controls-CompactDatePicker__month-list__item_selected-end"></div>
                </div>
            ) : null}
        </>
    );
}

export default function getDayTemplate(
    BaseDayTemplate: React.FunctionComponent,
    rangeModel,
    dayTemplateOptions,
    intersectionObserverConfig,
    counterProperty,
    counterClickCallback,
    size,
    selectionStyle,
    addButtonVisibilityCallback
): React.FunctionComponent {
    function DayTemplate(props: object): React.ReactElement {
        const counter =
            (props.value.extData?.get && props.value.extData?.get(counterProperty)) ||
            props.value.extData?.[counterProperty];

        const shouldShowAddButton = (): boolean => {
            if (addButtonVisibilityCallback) {
                return addButtonVisibilityCallback(props.value.date);
            }
            return true;
        };

        const showAddButton = shouldShowAddButton();

        const isAdaptive = unsafe_getRootAdaptiveMode().device.isPhone();

        const getOffsetClass = (): string => {
            if (counterProperty && props.value.day < 25 && props.value.isCurrentMonth) {
                if (size === 'm') {
                    return ' controls-margin_bottom-2xs';
                } else if (size === 'l') {
                    return ' controls-margin_bottom-s';
                }
            } else {
                return '';
            }
        };

        const onCounterClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (!props.value.selectionProcessing && showAddButton) {
                counterClickCallback?.(event, props.value.date);
                if (counterClickCallback) {
                    event.stopPropagation();
                }
            }
        };

        const getItemWrapperClassnames = (): string => {
            let className = '';
            if (!props.value.isCurrentMonth) {
                return className;
            }
            if (counter || counterClickCallback) {
                className += ' controls-CompactDatePickerItem_withCounter-wrapper';
            }
            if (props.value.selected && counter) {
                className += ' controls-CompactDatePickerItem_withCounter-counterBackground';
            }
            if (
                (!counter &&
                    counterClickCallback &&
                    showAddButton &&
                    !props.value.selectionProcessing) ||
                (counter && !props.value.selected)
            ) {
                className +=
                    ' controls-CompactDatePickerItem_withCounter-counterBackground_onHover';
            }
            if (
                counter &&
                counterClickCallback &&
                !props.value.selectionProcessing &&
                showAddButton
            ) {
                className += ' controls-CompactDatePickerItem_withCounter-addButton_withDelay';
            } else if (
                !counter &&
                counterClickCallback &&
                !props.value.selectionProcessing &&
                showAddButton
            ) {
                className += ' controls-CompactDatePickerItem_withCounter-addButton_withoutDelay';
            }
            return className;
        };

        const getBaseDayTemplate = () => {
            return (
                <div className={`${getItemWrapperClassnames()}${getOffsetClass()}`}>
                    <BaseDayTemplate
                        {...props}
                        date={props.value.day}
                        {...dayTemplateOptions}
                        fontWeight="normal"
                        sizeStyle="CompactDatePickerItem"
                        fontColorStyle="CompactDatePickerItem"
                        borderStyle="CompactDatePickerItem"
                        backgroundStyle="CompactDatePickerItem"
                        counterProperty={counterProperty}
                        selectionStyle={selectionStyle}
                        contentTemplate={(props) => {
                            return (
                                <CompactDatePickerDayContentTemplate
                                    {...props}
                                    rangeModel={rangeModel}
                                    hasCounter={
                                        !!(counter || counterClickCallback) &&
                                        size === 'l' &&
                                        !isAdaptive
                                    }
                                    onCounterClick={onCounterClick}
                                    counter={counter}
                                />
                            );
                        }}
                    />
                </div>
            );
        };

        const getDayTemplate = () => {
            if (props.value.today && props.value.isCurrentMonth) {
                return (
                    <IntersectionObserverContainer
                        onIntersect={intersectionObserverConfig.intersectionHandler}
                        onIntersectionObserverUnregister={
                            intersectionObserverConfig.unregisterHandler
                        }
                        threshold={[0, 0.01, 0.99, 1]}
                        customEvents={['onIntersect', 'onIntersectionObserverUnregister']}
                    >
                        {getBaseDayTemplate()}
                    </IntersectionObserverContainer>
                );
            }
            return getBaseDayTemplate();
        };

        return getDayTemplate();
    }

    return DayTemplate;
}
