import { IPropertyEditorProps } from 'Meta/types';
import { useState, useCallback, memo, useMemo, FC, Fragment } from 'react';
import { Number as NumberInput, Label } from 'Controls/input';
import { Control as Tumbler, ItemTemplate } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { Icon } from 'Controls/icon';
import 'css!Controls-editors/style';
import * as translate from 'i18n!Controls-editors';

interface IPaddingEditorProps extends IPropertyEditorProps<string> {
    value: string;
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
            icon: 'FrameControls-icons/designtime:icon-PaddingAll',
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
    const { value = '0px', onChange, LayoutComponent = Fragment } = props;

    const paddings = useMemo(() => value.split(' '), [value]);
    const [selectedType, setSelectedType] = useState(
        paddings.length === 1 ? TYPE_ALL : TYPE_BY_SIDE
    );

    const sideValueChangeHandler = useCallback(
        (side: PaddingSide, newSideValue?: number) => {
            const actualPaddings = [...paddings];
            actualPaddings[side] = `${newSideValue || '0'}px`;

            const result = actualPaddings.every((sideValue) => sideValue === '0px')
                ? '0px'
                : Array.from(
                      { length: PADDING_SIDES_COUNT },
                      (_, i) => actualPaddings[i] || '0px'
                  ).join(' ');

            onChange(result);
        },
        [paddings, onChange]
    );
    const allSidesChangeHandler = useCallback(
        (newValue: number) => {
            onChange(`${newValue || 0}px`);
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
                integersLength={INPUT_LENGTH}
                data-qa={dataQa}
            />
        </div>
    );

    return (
        <LayoutComponent>
            <Tumbler
                selectedKey={selectedType}
                items={typeSource}
                onSelectedKeyChanged={setSelectedType}
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
            {selectedType === TYPE_BY_SIDE ? (
                <div className={'ws-flexbox ws-flex-row PaddingEditor__sides'}>
                    {renderSideInput(PaddingSide.top, 'Верх', 'padding-editor__top')}
                    {renderSideInput(PaddingSide.right, 'Право', 'padding-editor__right')}
                    {renderSideInput(PaddingSide.bottom, 'Низ', 'padding-editor__bottom')}
                    {renderSideInput(PaddingSide.left, 'Лево', 'padding-editor__left')}
                </div>
            ) : selectedType === TYPE_ALL ? (
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
        </LayoutComponent>
    );
});
