import { Fragment, useMemo, memo } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { Model } from 'Types/entity';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { AddButton } from 'ExtControls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import { Button } from 'ExtControls/colorPicker';
import { RecordSet } from 'Types/collection';
import 'css!Controls-Graphs-editors/SeriesEditor';
import { ISingleSelectableOptions, TSelectedKey } from 'Controls/interface';
import { Title } from 'Controls/heading';
import * as translate from 'i18n!Controls-Graphs-editors';
import { Icon } from 'Controls/icon';
import { ICustomDataSetField } from 'Controls-Graphs-editors/RoundChartSeriesEditor';

const COLOR_PICKER_ITEMS = [
    { variable: '--graphs__baseColors_color-0', colorIndex: 0 },
    { variable: '--graphs__baseColors_color-1', colorIndex: 1 },
    { variable: '--graphs__baseColors_color-2', colorIndex: 2 },
    { variable: '--graphs__baseColors_color-3', colorIndex: 3 },
    { variable: '--graphs__baseColors_color-4', colorIndex: 4 },
    { variable: '--graphs__baseColors_color-5', colorIndex: 5 },
    { variable: '--graphs__baseColors_color-6', colorIndex: 6 },
    { variable: '--graphs__baseColors_color-7', colorIndex: 7 },
    { variable: '--graphs__baseColors_color-8', colorIndex: 8 },
    { variable: '--graphs__baseColors_color-9', colorIndex: 9 },
    { variable: '--graphs__baseColors_color-10', colorIndex: 10 },
    { variable: '--graphs__baseColors_color-11', colorIndex: 11 },
    { variable: '--graphs__baseColors_color-12', colorIndex: 12 },
];

type TValue = {
    name: string;
    valueProperty: string;
    colorIndex: number;
    xValueProperty: string;
};

interface ISeriesEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
    value: TValue[];
    onChange: (values: TValue[]) => void;
}

const SeriesEditor = memo((props: ISeriesEditorProps) => {
    const { connectedPropName, LayoutComponent = Fragment, value = [] } = props;

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    const [columnsRS] = useDataSetColumns(bindingFacade);

    const colorPickerItems = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'variable',
                rawData: COLOR_PICKER_ITEMS,
            }),
        []
    );

    const addButtonItems = useMemo(() => {
        if (columnsRS) {
            const names = props.value.map((item) => item.name);
            const items = columnsRS?.clone();
            items.each((item) => {
                if (names.includes(item?.get?.('Title'))) {
                    items.remove(item);
                }
            });
            return items;
        }
    }, [props.value, columnsRS]);

    if (!columnsRS) {
        return null;
    }

    const menuItemActivateHandler = (item: Model) => {
        if (!props.value?.map?.((item) => item.name)?.includes?.(item?.get?.('Title'))) {
            const frameFields = bindingFacade.getFields() || [];
            const xValueProperty =
                (frameFields as ICustomDataSetField[]).filter(
                    (item: ICustomDataSetField) => item.type === 'xValueProperty'
                )[0]?.value || '';
            const newValues: TValue[] = [
                ...value,
                {
                    valueProperty: item.get('Id').split('.')[1],
                    name: item.get('Title'),
                    colorIndex: value?.length + 1,
                    xValueProperty,
                },
            ];
            props.onChange(newValues);
            const oldFields = bindingFacade.getFields() || [];
            const xValuePropertyFields = oldFields.filter(
                (item: ICustomDataSetField) => item.type === 'xValueProperty'
            );
            const bindingFacadeClone = bindingFacade?.clone();
            bindingFacadeClone?.setFields([
                ...newValues.map((newValue) => ({
                    name: newValue.name,
                    type: 'valueProperty',
                    value: newValue.valueProperty,
                })),
                ...xValuePropertyFields,
            ]);
            setBindingFacade(bindingFacadeClone);
        }
        return null;
    };

    const closeButtonClickHandler = (name: TValue['name']) => {
        const newValues: TValue[] = [...value.filter((value) => value.name !== name)];
        props.onChange(newValues);
        bindingFacade?.setFields(
            newValues.map((value) => ({
                name: value.name,
            }))
        );
        setBindingFacade(bindingFacade);
    };

    const colorPickerSelectedKeysChangedHandler = (name: TValue['name'], color: TSelectedKey) => {
        const newValues = [
            ...value.map((item) => {
                if (item.name !== name) {
                    return item;
                }
                return {
                    ...item,
                    colorIndex: COLOR_PICKER_ITEMS.find((colorItem) => colorItem.variable === color)
                        ?.colorIndex,
                };
            }),
        ] as TValue[];
        props.onChange(newValues);
        const bindingFacadeClone = bindingFacade?.clone();
        bindingFacadeClone?.setFields(
            newValues.map((value) => ({
                name: value.name,
            }))
        );
        setBindingFacade(bindingFacadeClone);
    };

    return (
        // @ts-expect-error JSX
        <LayoutComponent title={null}>
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
                    readOnly={props.value.length === columnsRS.getCount()}
                    onMenuItemActivate={menuItemActivateHandler}
                    closeButtonVisibility={true}
                />
            </div>
            {!!value.length
                ? value?.map?.((item) => (
                      <div className="tw-grid tw-grid-cols-3 controls-margin_top-s" key={item.name}>
                          <div className="controls-fontsize-xl ws-ellipsis">{item.name}</div>
                          <Button
                              items={colorPickerItems}
                              columnsCount={2}
                              keyProperty="variable"
                              selectedKey={
                                  COLOR_PICKER_ITEMS.find(
                                      (colorPickerItem) =>
                                          colorPickerItem.colorIndex === item.colorIndex
                                  )?.variable
                              }
                              onSelectedKeyChanged={(color: TSelectedKey) =>
                                  colorPickerSelectedKeysChangedHandler(
                                      item.name,
                                      color
                                  ) as ISingleSelectableOptions['onSelectedKeyChanged']
                              }
                              className="controlsGraphsEditors__colorPickerButton controls_Graphs_theme-default tw-place-self-center"
                              panelClassName="controls_Graphs_theme-default"
                          />
                          <Icon
                              onClick={() => closeButtonClickHandler(item.name)}
                              iconSize="s"
                              iconStyle="unaccented"
                              className="tw-cursor-pointer tw-place-self-end"
                              icon="icon-CloseNew"
                          />
                      </div>
                  ))
                : null}
        </LayoutComponent>
    );
});

SeriesEditor.displayName = 'Controls-Graphs-editors/SeriesEditor:SeriesEditor';

export { SeriesEditor };
