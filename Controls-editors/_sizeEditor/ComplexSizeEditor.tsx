import { Fragment, useCallback, useMemo, useRef, useEffect } from 'react';
import { SizeEditorField } from './SizeEditorField';
import { IComponent, IPropertyEditorProps, ObjectMeta } from 'Meta/types';
import { IEditorLayoutProps, useControlSize } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';

import SizeEditorAspectRatioToggler from './AspectRatioToggler';
import { parseStyleValue } from './_utils/convert';
import { checkIsBaseSize, getBaseSizeType } from './_utils/functions';
import { sizeTypeToStringMap } from './_utils/maps';
import { useComplexSizeEditor } from './_hooks/useComplexSizeEditor';
import { TValue, BaseSizes, SizeType, KeyUnits, BASE_UNITS, ALL_UNITS } from './constants';

import * as rk from 'i18n!Controls-editors';

interface IComplexSizeEditor extends IPropertyEditorProps<TValue> {
    metaType?: ObjectMeta<TValue>;
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

export function ComplexSizeEditor(props: IComplexSizeEditor) {
    const { LayoutComponent = Fragment, value, metaType, onChange } = props;

    // lifehack for activate added size type
    const newElementRef = useRef('');
    const controlSize = useControlSize();
    const absoluteSize = useMemo(() => controlSize?.getSize(), [controlSize]);
    const percentSize = useMemo(() => {
        const parentSize = controlSize?.getParentSize();

        if (absoluteSize && parentSize) {
            return {
                width: Math.round((absoluteSize.width / parentSize.width) * 100),
                height: Math.round((absoluteSize.height / parentSize.height) * 100),
            };
        }
    }, [absoluteSize, controlSize]);

    const {
        value: editorValue,
        activeSizeTypes,
        inactiveSizeTypes,
        changeSizeHandler,
        addSizeHandler,
        delSizeHandler,
        isAspectRatioEnabled,
        isAspectRatioShown,
        toggleAspectRatio,
    } = useComplexSizeEditor({ value, metaType, absoluteSize, onChange });
    const dropdownSizes = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'key',
                rawData: inactiveSizeTypes.map((size) => ({
                    key: size,
                    title: sizeTypeToStringMap(size),
                })),
            }),
        [inactiveSizeTypes]
    );

    const getSizeEditor = useCallback(
        (type: SizeType) => {
            const { [type]: sizeValue } = editorValue || {};
            const isBaseSizeType = checkIsBaseSize(type);
            const editorUnits = isBaseSizeType ? ALL_UNITS : BASE_UNITS;
            const metaSizeProperty = metaType?.getProperties()[type];
            const title = metaSizeProperty?.getTitle() || sizeTypeToStringMap(type);
            const baseSizeType = getBaseSizeType(type);
            const { baseUnits } = parseStyleValue(editorValue[baseSizeType]) || {};

            const defaultUnit =
                !isBaseSizeType && [KeyUnits.percent, KeyUnits.fill].includes(baseUnits)
                    ? KeyUnits.percent
                    : undefined;

            return (
                <SizeEditorField
                    autoFocus={newElementRef.current === type}
                    key={type}
                    value={sizeValue || ''}
                    onChange={(sizeValue) => changeSizeHandler(type, sizeValue)}
                    onDelete={!isBaseSizeType ? () => delSizeHandler(type) : undefined}
                    title={title}
                    units={editorUnits}
                    defaultUnit={defaultUnit}
                    absoluteValue={absoluteSize?.[baseSizeType]}
                    percentValue={percentSize?.[baseSizeType]}
                    metaType={metaSizeProperty}
                    LayoutComponent={LayoutComponent}
                    afterEditorContent={
                        type === BaseSizes.height &&
                        isAspectRatioShown && (
                            <SizeEditorAspectRatioToggler
                                enabled={isAspectRatioEnabled}
                                onClick={toggleAspectRatio}
                            />
                        )
                    }
                />
            );
        },
        [
            editorValue,
            changeSizeHandler,
            LayoutComponent,
            absoluteSize,
            percentSize,
            isAspectRatioShown,
            isAspectRatioEnabled,
            toggleAspectRatio,
            delSizeHandler,
            newElementRef.current,
        ]
    );
    const onMenuItemActivate = useCallback(
        (item: Model) => {
            newElementRef.current = item.getKey();
            addSizeHandler(item.getKey() as SizeType);
        },
        [addSizeHandler, newElementRef.current]
    );

    // reset lifehack after render new size
    useEffect(() => {
        newElementRef.current = '';
    }, [editorValue, newElementRef.current]);

    return (
        <>
            <span className="controls_PropertyGrid__title">
                <span className="controls-margin_right-xs controls-PropertyGrid-sizeEditor__title">
                    {rk('Размер')}
                </span>
                {!!dropdownSizes.getCount() && (
                    <DropdownButton
                        icon="icon-AddButtonNew"
                        iconSize="m"
                        iconStyle="default"
                        viewMode="ghost"
                        buttonStyle="default"
                        inlineHeight="m"
                        menuHeadingCaption={rk('Добавить')}
                        closeButtonVisibility={true}
                        items={dropdownSizes}
                        keyProperty="key"
                        displayProperty="title"
                        onMenuItemActivate={onMenuItemActivate}
                        data-qa="Controls-editors_sizeEditor_ComplexSizeEditor__addButtonNew"
                    />
                )}
            </span>
            {activeSizeTypes.map(getSizeEditor)}
        </>
    );
}
