import { Fragment, memo, useMemo } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { Model } from 'Types/entity';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { AddButton } from 'ExtControls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import { Title } from 'Controls/heading';
import * as translate from 'i18n!Controls-Graphs-editors';
import { Icon } from 'Controls/icon';

export interface ICustomDataSetField {
    type?: string;
    name: string;
    value?: string;
}

type TValue = {
    name: string;
    valueProperty: string;
    displayProperty?: string;
};

interface IRoundChartSeriesEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
    value: TValue[];
    onChange: (values: TValue[]) => void;
}

const RoundChartSeriesEditor = memo((props: IRoundChartSeriesEditorProps) => {
    const { connectedPropName, LayoutComponent = Fragment, value = [] } = props;

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    const [columnsRS] = useDataSetColumns(bindingFacade);

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
            const displayProperty = (frameFields as ICustomDataSetField[]).filter(
                (item: ICustomDataSetField) => item.type === 'displayProperty'
            )[0]?.value;
            const newValues: TValue[] = [
                ...value,
                {
                    valueProperty: item.get('Id').split('.')[1],
                    name: item.get('Title'),
                    displayProperty,
                },
            ];
            props.onChange(newValues);
            const oldFields = bindingFacade.getFields() || [];
            const displayPropertyFields = oldFields.filter(
                (item: ICustomDataSetField) => item.type === 'displayProperty'
            );
            const bindingFacadeClone = bindingFacade?.clone?.();
            bindingFacadeClone?.setFields([
                ...newValues.map((newValue) => ({
                    name: newValue.name,
                    type: 'valueProperty',
                    value: newValue.valueProperty,
                })),
                ...displayPropertyFields,
            ]);
            setBindingFacade(bindingFacadeClone);
        }
        return null;
    };

    const closeButtonClickHandler = (name: TValue['name']) => {
        const newValues: TValue[] = [...value.filter((value) => value.name !== name)];
        props.onChange(newValues);
        const oldFields = bindingFacade.getFields() || [];
        const displayPropertyFields = oldFields.filter(
            (item: ICustomDataSetField) => item.type === 'displayProperty'
        );
        const bindingFacadeClone = bindingFacade?.clone?.();
        bindingFacadeClone?.setFields([
            ...newValues.map((value) => ({
                name: value.name,
            })),
            ...displayPropertyFields,
        ]);
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
                    onMenuItemActivate={menuItemActivateHandler}
                    closeButtonVisibility={true}
                    readOnly={value?.length >= 1}
                />
            </div>
            {!!value.length
                ? value?.map?.((item) => (
                      <div
                          className="tw-flex tw-w-full tw-items-center tw-justify-between controls-margin_top-s"
                          key={item.name}
                      >
                          <div className="controls-fontsize-xl">{item.name}</div>
                          <Icon
                              onClick={() => closeButtonClickHandler(item.name)}
                              iconSize="s"
                              iconStyle="unaccented"
                              icon="icon-CloseNew"
                              className="tw-cursor-pointer"
                          />
                      </div>
                  ))
                : null}
        </LayoutComponent>
    );
});

RoundChartSeriesEditor.displayName =
    'Controls-Graphs-editors/RoundChartSeriesEditor:RoundChartSeriesEditor';

export { RoundChartSeriesEditor };
