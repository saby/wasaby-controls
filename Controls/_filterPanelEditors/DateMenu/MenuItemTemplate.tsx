import * as rk from 'i18n!Controls';
import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { getDatesByFilterItem } from 'Controls/filter';
import { date as dateFormatter } from 'Types/formatter';
import { Base as DateUtil } from 'Controls/dateUtils';
import { TPeriod } from 'Controls/filterDateRangeEditor';
import { BY_PERIOD_KEY } from 'Controls/_filterPanelEditors/DateMenu/IDateMenu';
import getFormattedDateRangeCaption from '../GetFormattedDateRangeCaption';

function ContentTemplate(props): JSX.Element {
    const label = React.useMemo(() => {
        return getLabelByPeriod(props.item.contents.getKey(), props);
    }, [props.item.contents.getKey(), props.periodType, props.userPeriods, props.captionFormatter]);
    return (
        <div className="tw-flex tw-items-baseline">
            <div>{props.item.contents.get(props.displayProperty || 'title')}</div>
            {label ? (
                <div className="controls-padding_left-s controls-fontsize-xs controls-text-label">
                    {label}
                </div>
            ) : null}
        </div>
    );
}

export default React.forwardRef(function MenuItemTpl(props, ref) {
    const MenuItemTemplate = loadSync('Controls/menu:ItemTemplate');

    return (
        <MenuItemTemplate
            {...props}
            ref={ref}
            contentTemplate={(contentProps) => (
                <ContentTemplate
                    {...contentProps}
                    periodType={props.periodType}
                    userPeriods={props.userPeriods}
                    _date={props._date}
                />
            )}
        />
    );
});

function getCaption(
    customCaptionFormatter,
    startValue?: Date,
    endValue?: Date,
    _date?: Date
): string {
    let textValue;
    const captionFormatter = customCaptionFormatter || getFormattedDateRangeCaption;
    if (startValue && !endValue) {
        textValue =
            rk('c ') +
            dateFormatter(DateUtil.isValidDate(startValue) ? startValue : null, {
                mask: dateFormatter.FULL_DATE,
            });
    } else {
        textValue = captionFormatter(
            DateUtil.isValidDate(startValue) ? startValue : null,
            DateUtil.isValidDate(endValue) ? endValue : null,
            '',
            _date
        );
    }
    return textValue;
}

const excludedPeriods = ['today', 'yesterday', BY_PERIOD_KEY];

function getLabelByPeriod(key: TPeriod, props): string | void {
    if (!excludedPeriods.includes(key) && (props.periodType === 'last' || key !== 'week')) {
        const period = getDatesByFilterItem({
            name: props.name,
            value: key,
            editorOptions: {
                periodType: props.periodType,
                userPeriods: props.userPeriods,
                _date: props._date,
            },
        });
        let label = '';
        if (period) {
            if (props.periodType === 'last') {
                label = getCaption(props.captionFormatter, period[0], void 0, props._date);
            } else if (key !== 'week') {
                label = getCaption(props.captionFormatter, period[0], period[1], props._date);
            }
            if (key === 'month' && props.periodType !== 'last') {
                label = label.toLowerCase();
            }
        }
        return label;
    }
}
