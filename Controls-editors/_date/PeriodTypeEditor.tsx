import { Fragment, useCallback, useMemo, useRef } from 'react';
import { RecordSet } from 'Types/collection';

import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Selector } from 'Controls/dropdown';
import * as translate from 'i18n!Controls-editors';
import { StickyOpener } from 'Controls/popup';

const CUSTOM_PERIOD_KEY = 'byPeriod';
type TPeriodTypes = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'byPeriod' | 'byFilter';
type TPeriodDateValueType = [Date, Date];
type TPeriodValueType = TPeriodTypes | TPeriodDateValueType;

/**
 * @public
 */
type IPeriodEditorProps = IPropertyGridPropertyEditorProps<TPeriodValueType>;

const KEY_PROPERTY = 'id';
const DISPLAY_PROPERTY = 'title';

const CONSTANT_TYPES: {
    id: TPeriodTypes;
    title: string;
}[] = [
    {
        id: 'today',
        title: translate('За сегодня'),
    },
    {
        id: 'yesterday',
        title: translate('За вчера'),
    },
    {
        id: 'week',
        title: translate('За неделю'),
    },
    {
        id: 'month',
        title: translate('За месяц'),
    },
    {
        id: 'year',
        title: translate('За год'),
    },
    {
        id: CUSTOM_PERIOD_KEY,
        title: translate('За период'),
    },
    {
        id: 'byFilter',
        title: translate('Взять из фильтра'),
    },
];

const items = new RecordSet({
    rawData: CONSTANT_TYPES,
    keyProperty: KEY_PROPERTY,
});

/**
 * Редактор типа "Периода"
 * @public
 */
function PeriodTypeEditor(props: IPeriodEditorProps) {
    const { value, onChange, LayoutComponent = Fragment } = props;

    const dropdownRef = useRef();

    const openDatePopup = useCallback(() => {
        const stickyOpener = new StickyOpener();

        const templateOptions = {};

        if (Array.isArray(value)) {
            const [startValue, endValue] = value;
            templateOptions.startValue = startValue;
            templateOptions.endValue = endValue;
        }

        stickyOpener.open({
            template: 'Controls/datePopup',
            opener: dropdownRef,
            target: dropdownRef,
            closeOnOutsideClick: true,
            eventHandlers: {
                onResult: (startValue: Date, endValue: Date) => {
                    onChange?.([startValue, endValue]);
                    stickyOpener.close();
                    stickyOpener.destroy();
                },
            },
        });
    }, [onChange, value]);

    const selectedKeys = useMemo(() => {
        return getSelectedKeys(value);
    }, [value]);

    const onSelectedKeysChange = useCallback(
        (value) => {
            const [periodType] = value;

            if (periodType === CUSTOM_PERIOD_KEY) {
                return openDatePopup();
            }

            onChange?.(periodType);
        },
        [onChange, openDatePopup]
    );

    return (
        <LayoutComponent>
            <Selector
                ref={dropdownRef}
                data-qa="controls-PropertyGrid__editor_period"
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onSelectedKeysChange}
                emptyKey={'month'}
                items={items}
                displayProperty={DISPLAY_PROPERTY}
                keyProperty={KEY_PROPERTY}
            />
        </LayoutComponent>
    );
}

function isDatePropertyValue(value: TPeriodValueType): value is TPeriodDateValueType {
    const values = Array.isArray(value) ? value : [value];
    return values.some((value) => {
        return value instanceof Date;
    });
}

function isConstantPropertyValue(value: TPeriodValueType): value is TPeriodTypes {
    return (
        !isDatePropertyValue(value) &&
        CONSTANT_TYPES.some((entry) => {
            return entry.id === value;
        })
    );
}

function getSelectedKeys(period?: TPeriodValueType): string[] {
    const selectedKeys = [];
    if (period) {
        if (isDatePropertyValue(period)) {
            selectedKeys.push(CUSTOM_PERIOD_KEY);
        } else if (isConstantPropertyValue(period)) {
            selectedKeys.push(period);
        }
    }
    return selectedKeys;
}

// @ts-ignore ReactDevTool component name
PeriodTypeEditor.displayName = 'Controls-editors/date:PeriodEditor';

export { PeriodTypeEditor, IPeriodEditorProps };
