import { Fragment, useMemo, memo, useRef, useEffect } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { Model } from 'Types/entity';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { AddButton } from 'ExtControls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import { CloseButton } from 'Controls/extButtons';
import { Button } from 'ExtControls/colorPicker';
import { RecordSet } from 'Types/collection';
import 'css!Controls-Graphs-editors/SeriesEditor';
import { ISingleSelectableOptions, TSelectedKey } from 'Controls/interface';
import { Title } from 'Controls/heading';
import * as translate from 'i18n!Controls-Graphs-editors';

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
};

interface ISeriesEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
    value: TValue[];
    onChange: (values: TValue[]) => void;
}

const SeriesEditor = memo((props: ISeriesEditorProps) => {
    const { connectedPropName, LayoutComponent = Fragment, value = [] } = props;
    const facadeName = useRef<string | null>(null);
    const isMount = useRef(false);

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    useEffect(() => {
        if (!isMount.current) {
            isMount.current = true;
            facadeName.current = bindingFacade?.getDataSetName?.() as string;
        }
    }, []);

    useEffect(() => {
        const name = bindingFacade?.getDataSetName?.();
        if (isMount.current && name && name !== facadeName.current) {
            facadeName.current = name;
            props.onChange([]);
        }
    }, [bindingFacade]);

    const [columnsRS] = useDataSetColumns(bindingFacade);

    const colorPickerItems = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'variable',
                rawData: COLOR_PICKER_ITEMS,
            }),
        []
    );

    if (!columnsRS) {
        return null;
    } else if (!!props.value?.length && columnsRS) {
        const names = props.value.map((item) => item.name);
        columnsRS.each((item) => {
            if (names.includes(item?.get?.('Title'))) {
                columnsRS.remove(item);
            }
        });
    }

    const menuItemActivateHandler = (item: Model) => {
        if (!props.value?.map?.((item) => item.name)?.includes?.(item?.get?.('Title'))) {
            const newValues: TValue[] = [
                ...value,
                {
                    valueProperty: item.get('Title'),
                    name: item.get('Title'),
                    colorIndex: value?.length + 1,
                },
            ];
            props.onChange(newValues);
            bindingFacade?.setFields(
                newValues.map((value) => ({
                    name: value.name,
                }))
            );
            setBindingFacade(bindingFacade);
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
        bindingFacade?.setFields(
            newValues.map((value) => ({
                name: value.name,
            }))
        );
        setBindingFacade(bindingFacade);
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
                    items={columnsRS}
                    onMenuItemActivate={menuItemActivateHandler}
                />
            </div>
            {!!value.length
                ? value?.map?.((item) => (
                      <div
                          className="tw-flex tw-w-full tw-items-center tw-justify-between controls-margin_top-s"
                          key={item.name}
                      >
                          <div className="controls-fontsize-xl">
                              {item.name[0].toUpperCase() + item.name.slice(1).toLowerCase()}
                          </div>
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
                              className="controlsGraphsEditors__colorPickerButton controls_Graphs_theme-default"
                              panelClassName="controls_Graphs_theme-default"
                          />
                          <CloseButton
                              viewMode="linkButton"
                              onClick={() => closeButtonClickHandler(item.name)}
                          />
                      </div>
                  ))
                : null}
        </LayoutComponent>
    );
});

SeriesEditor.displayName = 'Controls-Graphs-editors/SeriesEditor:SeriesEditor';

export { SeriesEditor };
