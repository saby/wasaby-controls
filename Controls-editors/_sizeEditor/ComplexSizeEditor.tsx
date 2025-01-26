import { Fragment, useCallback, useMemo } from 'react';
import { SizeEditorField, BASE_UNITS, ALL_UNITS } from './SizeEditorField';
import { IComponent, IPropertyEditorProps, ObjectMeta } from 'Meta/types';
import { IEditorLayoutProps, useControlSize } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';

import * as rk from 'i18n!Controls-editors';

import SizeEditorAspectRatioToggler from './AspectRatioToggler';
import SizeEditorTitle from './Title';
import { checkIsBaseSize } from './changeSize';
import { useComplexSizeEditor } from './_hooks/useComplexSizeEditor';
import { TValue, BaseSizes, LimitSizes, SizeType } from './constants';

const getSizeNameByType = (type: SizeType): string => {
    switch (type) {
        case BaseSizes.width:
            return rk('Ширина');
        case BaseSizes.height:
            return rk('Высота');
        case LimitSizes.maxWidth:
            return rk('Max ширина');
        case LimitSizes.maxHeight:
            return rk('Max высота');
        case LimitSizes.minWidth:
            return rk('Min ширина');
        case LimitSizes.minHeight:
            return rk('Min высота');
    }
};

interface IComplexSizeEditor extends IPropertyEditorProps<TValue> {
    metaType?: ObjectMeta<TValue>;
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

export function ComplexSizeEditor(props: IComplexSizeEditor) {
    const { LayoutComponent = Fragment, value, metaType, onChange } = props;

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
    } = useComplexSizeEditor({ value, metaType, onChange });
    const dropdownSizes = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'key',
                rawData: inactiveSizeTypes.map((size) => ({
                    key: size,
                    title: getSizeNameByType(size),
                })),
            }),
        [inactiveSizeTypes]
    );

    const getSizeEditor = useCallback(
        (type: SizeType) => {
            const { [type]: sizeValue } = editorValue || {};
            const editorUnits = checkIsBaseSize(type) ? ALL_UNITS : BASE_UNITS;
            const metaSizeProperty = metaType?.getProperties()[type];
            const title = metaSizeProperty?.getTitle() || getSizeNameByType(type);
            const sizeEditorTitle = checkIsBaseSize(type)
                ? title
                : () => (
                      <SizeEditorTitle title={title} delSizeHandler={() => delSizeHandler(type)} />
                  );

            return (
                <SizeEditorField
                    key={type}
                    value={sizeValue || ''}
                    onChange={(sizeValue) => changeSizeHandler(type, sizeValue)}
                    // нужно изменить макет и переделать удаление
                    // title={sizeEditorTitle}
                    title={title}
                    units={editorUnits}
                    absoluteValue={absoluteSize?.[type]}
                    percentValue={percentSize?.[type]}
                    metaType={metaSizeProperty}
                    LayoutComponent={LayoutComponent}
                    afterEditorContent={
                        type === BaseSizes.width &&
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
        ]
    );
    const onMenuItemActivate = useCallback(
        (item: Model) => addSizeHandler(item.getKey() as SizeType),
        [addSizeHandler]
    );

    return (
        <>
            {activeSizeTypes.map(getSizeEditor)}
            {!!dropdownSizes.getCount() && (
                <LayoutComponent title=" " required={false}>
                    <DropdownButton
                        icon="icon-AddButtonNew"
                        iconStyle="unaccented"
                        iconSize="xs"
                        items={dropdownSizes}
                        caption="Размер"
                        keyProperty="key"
                        displayProperty="title"
                        viewMode="link"
                        closeButtonVisibility={false}
                        headerTemplate={null}
                        buttonStyle="unaccented"
                        fontColorStyle="unaccented"
                        inlineHeight="m"
                        onMenuItemActivate={onMenuItemActivate}
                    />
                </LayoutComponent>
            )}
        </>
    );
}
