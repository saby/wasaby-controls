import { useMemo, useState, useCallback } from 'react';
import { Label } from 'Controls/input';
import { ItemTemplate as DefaultItemTemplate, IItemTemplateOptions } from 'Controls/menu';
import { EnumEditor } from 'Controls-editors/dropdown';
import { Date as DateControl } from 'Controls/baseDecorator';
import { Range } from 'Controls/dateUtils';
import { date as formatDate } from 'Types/formatter';
import {
    shiftDateByMonths,
    weekDays,
    month,
    quarter,
    halfYear,
    year,
} from 'Controls-ListEnv-editors/dateRangeSource';
import { minRangeData } from 'Controls-ListEnv-meta/DateRangeFilterItemType';
import 'css!Controls-ListEnv-editors/dateRangeEditor';

const today = new Date();
const currentDateRangeMap = {
    month: {
        value: today,
        format: formatDate.FULL_MONTH,
    },
    quarter: {
        value: today,
        format: formatDate.FULL_QUARTER,
    },
    halfyear: {
        value: today,
        format: formatDate.FULL_HALF_YEAR,
    },
    year: {
        value: today,
        format: formatDate.FULL_YEAR,
    },
};
const lastDateRangeMap = {
    week: {
        value: Range.shiftPeriodByDays(today, today, -weekDays)[0],
        format: formatDate.FULL_DATE,
    },
    month: {
        value: shiftDateByMonths(month),
        format: formatDate.FULL_DATE,
    },
    quarter: {
        value: shiftDateByMonths(quarter),
        format: formatDate.FULL_DATE,
    },
    halfyear: {
        value: shiftDateByMonths(halfYear),
        format: formatDate.FULL_DATE,
    },
    year: {
        value: shiftDateByMonths(year),
        format: formatDate.FULL_DATE,
    },
};

function AdditionalTextTemplate(props: IItemTemplateOptions): JSX.Element | null {
    const { item, onItemClick } = props;
    const id = item?.item?.get('value');
    const type = item?.item?.get('type');
    const dateValue = type === 'last' ? lastDateRangeMap[id] : currentDateRangeMap[id];
    const minRangeType = useMemo(() => item?.item?.get('minRangeType'), [item]);
    const [value, setValue] = useState(() => item?.item?.get('minRangeValue'));
    const onChange = useCallback(
        (newValue) => {
            setValue(newValue);
            // TODO: https://online.sbis.ru/opendoc.html?guid=4948b8e8-14da-44d7-9953-345e6020d05b&client=3
            // можно ли по-другому обрабатывать выбор минимального периода?
            const newItem = item.item.clone();
            newItem.set('value', newValue);
            onItemClick(newItem);
        },
        [item.item, onItemClick]
    );

    return minRangeType ? (
        <div>
            <Label caption={minRangeType.getTitle()} />
            <EnumEditor
                options={minRangeData}
                value={value}
                onChange={onChange}
                type={minRangeType}
            />
        </div>
    ) : dateValue ? (
        <>
            {type === 'last' && (
                <span className="controls-padding_left-xs controls-fontsize-3xs controls-text-unaccented">
                    с{' '}
                </span>
            )}
            <DateControl
                value={dateValue.value}
                format={dateValue.format}
                fontColorStyle="unaccented"
                fontSize="3xs"
                className={type === 'last' ? '' : 'controls-padding_left-xs'}
            />
        </>
    ) : null;
}

export default function DateRangeEditorItemTemplate(props: IItemTemplateOptions): JSX.Element {
    const { item, treeItem, itemData } = props;
    const isArbitrarySelected = useMemo(
        () => item?.item?.get('value') === 'arbitrary' && treeItem?.isSelected(),
        [item, treeItem]
    );
    const isAdditionalTextVisible = useMemo(
        () => isArbitrarySelected || item?.item?.get('value') !== 'arbitrary',
        [isArbitrarySelected, item]
    );
    const isHidden = useMemo(() => item?.item?.get('value')?.includes('Arbitrary'), [item]);
    const additionalTextTemplate = useMemo(
        () => (isAdditionalTextVisible ? AdditionalTextTemplate.bind(null, props) : ''),
        [isAdditionalTextVisible]
    );
    const className = useMemo(
        () => (isArbitrarySelected ? 'DateRangeEditor__minRange' : ''),
        [isArbitrarySelected]
    );
    const newItemData = useMemo(() => {
        return {
            ...itemData,
            nodeProperty: '',
        };
    }, [itemData]);

    if (isHidden) {
        return null;
    } else {
        return (
            <DefaultItemTemplate
                {...props}
                additionalTextTemplate={additionalTextTemplate}
                className={className}
                itemData={newItemData}
            />
        );
    }
}
