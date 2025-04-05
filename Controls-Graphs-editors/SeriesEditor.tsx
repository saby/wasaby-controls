import * as React from 'react';
import { DataSetBindingFacade, IDataSetField } from 'Frame/base';
import { Model } from 'Types/entity';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { AddButton } from 'ExtControls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import { Title } from 'Controls/heading';
import { IItemPadding } from 'Controls/display';
import * as translate from 'i18n!Controls-Graphs-editors';
import { SeriesRemoveButtonTemplate } from './common/SeriesRemoveButtonTemplate';
import { SeriesColorPickerTemplate } from './common/SeriesColorPickerTemplate';
import { useSeriesMetaProp } from './hooks/useSeriesMetaProp';
import { ItemsView as GridView, IRowProps, IColumnConfig } from 'Controls/grid';

type TValue = {
    name: string;
    valueProperty: string;
    displayProperty?: string;
};

interface ISeriesEditor {
    LayoutComponent: unknown;
    value: TValue[];
    onChange: (values: TValue[]) => void;
    connectedPropName: string;
    displayProperty: string;
    valueProperty: string;
}

/**
 * Редактор измерений графика
 */
const SeriesEditor = React.memo((props: ISeriesEditor) => {
    const {
        connectedPropName,
        LayoutComponent = React.Fragment,
        value = [],
        onChange,
        displayProperty = 'xValueProperty',
        valueProperty = 'valueProperty',
    } = props;

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    const [columnsRS] = useDataSetColumns(bindingFacade, true);

    const [seriesMeta, setSeriesMeta] = useSeriesMetaProp({
        bindingFacade,
        columnsRS,
        onChange,
        value,
        displayProperty,
        valueProperty,
        colorSelectionEnabled: true,
    });

    const addButtonItems = React.useMemo(() => {
        if (!columnsRS) {
            return;
        }

        const names = value.map((item) => item.name);
        const items = columnsRS?.clone();
        items.each((item) => {
            if (names.includes(item?.get?.('Title'))) {
                items.remove(item);
            }
        });
        return items;
    }, [value, columnsRS]);

    const onFieldSelect = React.useCallback(
        (item: Model) => {
            const frameFields = bindingFacade.getAggregate() || [];
            const frameFieldIds = frameFields.map((field) => field.name);

            if (frameFieldIds?.includes?.(item?.get?.('Id'))) {
                return;
            }

            const newValues: IDataSetField[] = [
                ...frameFields,
                {
                    name: item.get('Id'),
                },
            ];

            const bindingFacadeClone = bindingFacade?.clone?.();
            bindingFacadeClone?.setAggregate(newValues);
            setBindingFacade(bindingFacadeClone);
        },
        [bindingFacade, setBindingFacade]
    );

    const onFieldDelete = React.useCallback(
        (key: string) => {
            const frameFields = bindingFacade.getAggregate() || [];

            const newValues: IDataSetField[] = [
                ...frameFields.filter((frameField) => !frameField.name.endsWith(key)),
            ];

            const bindingFacadeClone = bindingFacade?.clone?.();
            bindingFacadeClone?.setAggregate(newValues);
            setBindingFacade(bindingFacadeClone);
        },
        [bindingFacade, setBindingFacade]
    );

    const onColorSelected = React.useCallback(
        (key: string, colorIndex: number) => {
            setSeriesMeta(key, 'colorIndex', colorIndex);
        },
        [setSeriesMeta]
    );

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return [
            {
                displayProperty: 'name',
            },
            {
                render: (
                    <SeriesColorPickerTemplate
                        onChange={onColorSelected}
                        keyProperty={valueProperty}
                    />
                ),
            },
            {
                width: 'auto',
                render: (
                    <SeriesRemoveButtonTemplate
                        onClick={onFieldDelete}
                        keyProperty={valueProperty}
                    />
                ),
            },
        ];
    }, [onColorSelected, onFieldDelete]);

    if (!columnsRS) {
        return null;
    }

    return (
        // @ts-expect-error JSX
        <LayoutComponent title={null}>
            <div className="controlsGraphsEditors__separator"></div>
            <div className="tw-flex tw-items-center">
                <Title
                    caption={translate('Показатели')}
                    readOnly={true}
                    className="controls-margin_right-m"
                />
                <AddButton
                    keyProperty="Id"
                    // @ts-expect-error JSX
                    displayProperty="Title"
                    items={addButtonItems}
                    onMenuItemActivate={onFieldSelect}
                    closeButtonVisibility={true}
                    readOnly={value?.length === columnsRS.getCount()}
                />
            </div>
            <GridView
                items={seriesMeta}
                columns={columns}
                getRowProps={getRowProps}
                markerVisibility={'hidden'}
                itemPadding={GRID_ITEM_PADDING}
            />
        </LayoutComponent>
    );
});

const GRID_ITEM_PADDING: IItemPadding = {
    left: 'null',
    right: 'null',
};

function getRowProps(_item: Model): IRowProps {
    return {
        hoverBackgroundStyle: 'transparent',
        cursor: 'default',
    };
}

SeriesEditor.displayName = 'Controls-Graphs-editors/SeriesEditor:SeriesEditor';

export { SeriesEditor };
