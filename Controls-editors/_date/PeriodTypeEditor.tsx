import { Model, format, adapter } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Fragment, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { DateMenu } from 'Controls/filterPanelEditors';
import * as translate from 'i18n!Controls-editors';

type TPeriodValue = {
    type: 'Period';
    value: 'string' | [Date, Date];
};

/**
 * @public
 */
type IPeriodEditorProps = IPropertyGridPropertyEditorProps<TPeriodValue>;

const KEY_PROPERTY = 'id';
const DISPLAY_PROPERTY = 'title';

const items = new RecordSet({
    rawData: [
        {
            id: 'today',
            title: translate('За сегодня'),
        },
        {
            id: 'yesterday',
            title: translate('За вчера'),
        },
        {
            id: 'tomorrow',
            title: translate('Завтра'),
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
            id: 'quarter',
            title: translate('За квартал'),
        },
        {
            id: 'halfyear',
            title: translate('За полгода'),
        },
        {
            id: 'year',
            title: translate('За год'),
        },
    ],
    keyProperty: KEY_PROPERTY,
});

/**
 * Редактор типа "Периода"
 * @public
 */
function PeriodTypeEditor(props: IPeriodEditorProps) {
    const { value, onChange, LayoutComponent = Fragment } = props;

    return (
        <LayoutComponent>
            <DateMenu
                data-qa="controls-PropertyGrid__editor_period"
                value={value}
                onPropertyValueChanged={onChange}
                items={items}
                displayProperty={DISPLAY_PROPERTY}
                keyProperty={KEY_PROPERTY}
                propertyValue={'today'}
                minRange="day"
                editorMode="Selector"
                editorsViewMode="cloud"
                selectionType="range"
                viewMode="basic"
                periodItemVisible={true}
                chooseYears={true}
                chooseHalfyears={true}
                chooseQuarters={true}
                chooseMonths={true}
            />
        </LayoutComponent>
    );
}

// @ts-ignore ReactDevTool component name
PeriodTypeEditor.displayName = 'Controls-editors/date:PeriodEditor';

export { PeriodTypeEditor, IPeriodEditorProps };
