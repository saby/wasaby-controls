import { IPropertyEditorProps } from 'Meta/types';
import { useCallback, memo, useMemo, Fragment, FC, useState } from 'react';
import { Control as Tumbler, ItemTemplate } from 'Controls/Tumbler';
import { Label, Number as NumberInput } from 'Controls/input';
import 'css!Controls-editors/style';
import * as translate from 'i18n!Controls-editors';
import { RecordSet } from 'Types/collection';
import { Icon } from 'Controls/icon';

interface IBorderRadiusEditorProps extends IPropertyEditorProps<string> {
    value: string;
    onChange: (value: string) => void;
    LayoutComponent?: FC;
}

enum BorderRadiusSide {
    topLeft = 0,
    topRight = 1,
    bottomRight = 2,
    bottomLeft = 3,
}

const TYPE_ALL = 'all';
const TYPE_BY_SIDE = 'by_side';
const INPUT_LENGTH = 3;
const BORDER_RADIUS_SIDES_COUNT = 4;

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

export const BorderRadiusEditor = memo(function BorderRadiusEditor(
    props: IBorderRadiusEditorProps
) {
    const { value = '0px', onChange, LayoutComponent = Fragment } = props;

    const borderRadiusSideValues = useMemo(() => value.split(' '), [value]);
    const [selectedType, setSelectedType] = useState(
        borderRadiusSideValues.length === 1 ? TYPE_ALL : TYPE_BY_SIDE
    );

    const sideValueChangeHandler = useCallback(
        (borderSide: BorderRadiusSide, newValue?: number) => {
            const actualBorderRadius = [...borderRadiusSideValues];
            actualBorderRadius[borderSide] = `${newValue || 0}px`;

            const result = actualBorderRadius.every((sideValue) => sideValue === '0px')
                ? '0px'
                : Array.from(
                      { length: BORDER_RADIUS_SIDES_COUNT },
                      (_, i) => actualBorderRadius[i] || '0px'
                  ).join(' ');

            onChange(result);
        },
        [onChange, borderRadiusSideValues]
    );
    const allSidesChangeHandler = useCallback(
        (newValue: number) => {
            onChange(`${newValue || 0}px`);
        },
        [onChange]
    );

    const renderBorderRadiusInput = (
        side: BorderRadiusSide,
        label: string,
        title: string,
        dataQa: string
    ) => (
        <div className="ws-flexbox ws-flex-column">
            <Label caption={translate(label)} fontSize="xs" attrs={{ title: translate(title) }} />
            <NumberInput
                value={Number(borderRadiusSideValues[side]?.replace('px', '')) || 0}
                precision={0}
                valueChangedCallback={(newValue: number) => sideValueChangeHandler(side, newValue)}
                onlyPositive
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
                customEvents={TumblerCustomEvents}
                onSelectedKeyChanged={setSelectedType}
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
                dataQA="border-radius-editor__tumbler"
            />
            {selectedType === TYPE_BY_SIDE ? (
                <div className="ws-flexbox ws-flex-row BorderRadiusEditor__sides">
                    {renderBorderRadiusInput(
                        BorderRadiusSide.topLeft,
                        'В-Л',
                        'Верх-лево',
                        'border-radius-editor__topLeft'
                    )}
                    {renderBorderRadiusInput(
                        BorderRadiusSide.topRight,
                        'В-П',
                        'Верх-право',
                        'border-radius-editor__topRight'
                    )}
                    {renderBorderRadiusInput(
                        BorderRadiusSide.bottomRight,
                        'Н-П',
                        'Низ-право',
                        'border-radius-editor__bottomRight'
                    )}
                    {renderBorderRadiusInput(
                        BorderRadiusSide.bottomLeft,
                        'Н-Л',
                        'Низ-лево',
                        'border-radius-editor__bottomLeft'
                    )}
                </div>
            ) : selectedType === TYPE_ALL ? (
                <div className="ws-flexbox ws-flex-column">
                    <Label
                        caption={translate('Все углы')}
                        fontSize="xs"
                        attrs={{ title: translate('Все углы') }}
                    />
                    <NumberInput
                        value={Number(borderRadiusSideValues[0]?.replace('px', '')) || 0}
                        precision={0}
                        valueChangedCallback={allSidesChangeHandler}
                        onlyPositive
                        integersLength={INPUT_LENGTH}
                        data-qa="border-radius-editor__all"
                    />
                </div>
            ) : null}
        </LayoutComponent>
    );
});
