import { IPropertyEditorProps } from 'Meta/types';
import { useState, useCallback, memo, useMemo, FC, Fragment } from 'react';
import { Number as NumberInput, Label } from 'Controls/input';
import { Control as Tumbler, ItemTemplate } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { Icon } from 'Controls/icon';
import 'css!Controls-editors/style';
import * as translate from 'i18n!Controls-editors';

interface IPaddingEditorProps extends IPropertyEditorProps<string> {
    onChange: (value: string) => void;
    LayoutComponent?: FC;
}

enum PaddingSide {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3,
}

const TYPE_ALL = 'all';
const TYPE_BY_SIDE = 'by_side';
const INPUT_LENGTH = 3;
const PADDING_SIDES_COUNT = 4;

const typeSource = new RecordSet({
    rawData: [
        {
            id: TYPE_ALL,
            icon: 'icon-AllSides2',
            tooltip: translate('Все'),
        },
        {
            id: TYPE_BY_SIDE,
            icon: 'icon-AllSides',
            tooltip: translate('Отдельно'),
        },
    ],
    keyProperty: 'id',
});

const TumblerCustomEvents = ['onSelectedKeyChanged'];

export const PaddingEditor = memo(function (props: IPaddingEditorProps) {
    const { onChange, LayoutComponent = Fragment } = props;
    const value = props.value ?? '0px';

    const paddings = useMemo(() => value.split(' '), [value]);
    const isSingleValue = paddings.length === 1;

    const [state, setState] = useState({
        selectedType: isSingleValue ? TYPE_ALL : TYPE_BY_SIDE,
        allSidesValue: isSingleValue ? value : '0px',
        bySideValues: isSingleValue ? Array(PADDING_SIDES_COUNT).fill(value) : paddings,
    });

    const selectedKeyChanged = useCallback(
        (selectedKey: string) => {
            setState((prevState) => ({
                selectedType: selectedKey,
                allSidesValue: selectedKey === TYPE_ALL ? prevState.allSidesValue : value,
                bySideValues: selectedKey === TYPE_BY_SIDE ? prevState.bySideValues : paddings,
            }));

            onChange(selectedKey === TYPE_ALL ? state.allSidesValue : state.bySideValues.join(' '));
        },
        [onChange, value, paddings, state.allSidesValue, state.bySideValues]
    );

    const sideValueChangeHandler = useCallback(
        (paddingSide: PaddingSide, newValue?: number) => {
            setState((prevState) => {
                const updatedValues = [...prevState.bySideValues];
                updatedValues[paddingSide] = `${newValue || 0}px`;

                const newValueStr = updatedValues.every((sideValue) => sideValue === '0px')
                    ? '0px'
                    : updatedValues.join(' ');

                onChange(newValueStr);

                return { ...prevState, bySideValues: updatedValues };
            });
        },
        [onChange]
    );

    const allSidesChangeHandler = useCallback(
        (newValue: number) => {
            const newValueStr = `${newValue || 0}px`;
            setState((prevState) => ({ ...prevState, allSidesValue: newValueStr }));
            onChange(newValueStr);
        },
        [onChange]
    );

    const renderSideInput = (side: PaddingSide, label: string, dataQa: string) => (
        <div className={'ws-flexbox ws-flex-column'}>
            <Label caption={translate(label)} fontSize={'xs'} attrs={{ tile: translate(label) }} />
            <NumberInput
                value={Number(paddings?.[side]?.replace('px', '')) || 0}
                precision={0}
                valueChangedCallback={(newValue: number) => sideValueChangeHandler(side, newValue)}
                onlyPositive={true}
                changeValueByArrows
                integersLength={INPUT_LENGTH}
                data-qa={dataQa}
            />
        </div>
    );

    return (
        <LayoutComponent>
            <div>
                <Tumbler
                    selectedKey={state.selectedType}
                    items={typeSource}
                    onSelectedKeyChanged={selectedKeyChanged}
                    customEvents={TumblerCustomEvents}
                    itemTemplate={(itemTemplateProps) => {
                        return (
                            <ItemTemplate
                                {...itemTemplateProps}
                                item={itemTemplateProps.item}
                                fontSize={itemTemplateProps.fontSize}
                                contentTemplate={() => {
                                    return (
                                        <Icon
                                            iconSize={'s'}
                                            icon={itemTemplateProps.item.get('icon') as string}
                                        />
                                    );
                                }}
                            />
                        );
                    }}
                    data-qa={'padding-editor__tumbler'}
                />
                {state.selectedType === TYPE_BY_SIDE ? (
                    <div className={'ws-flexbox ws-flex-row PaddingEditor__sides'}>
                        {renderSideInput(PaddingSide.top, 'Верх', 'padding-editor__top')}
                        {renderSideInput(PaddingSide.right, 'Право', 'padding-editor__right')}
                        {renderSideInput(PaddingSide.bottom, 'Низ', 'padding-editor__bottom')}
                        {renderSideInput(PaddingSide.left, 'Лево', 'padding-editor__left')}
                    </div>
                ) : state.selectedType === TYPE_ALL ? (
                    <div className="ws-flexbox ws-flex-column">
                        <Label caption={translate('Все стороны')} fontSize={'xs'} />
                        <NumberInput
                            value={Number(value?.replace('px', '')) || 0}
                            precision={0}
                            valueChangedCallback={allSidesChangeHandler}
                            onlyPositive={true}
                            integersLength={INPUT_LENGTH}
                            data-qa="padding-editor__all"
                        />
                    </div>
                ) : null}
            </div>
        </LayoutComponent>
    );
});
