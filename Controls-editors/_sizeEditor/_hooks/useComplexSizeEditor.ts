import { useState, useCallback, useMemo } from 'react';
import { ObjectMeta } from 'Meta/types';

import { checkIsBaseSize } from '../_utils/functions';
import { parseStyleValue } from '../_utils/convert';
import { changeSize, changeAspectRatio } from '../changeSize';
import { TValue, SizeType, LIMIT_SIZE_TYPES, BASE_SIZE_TYPES } from '../constants';

export type TUseComplexSizeEditorProps = {
    value?: TValue;
    metaType?: ObjectMeta<TValue>;
    onChange?: (value: TValue) => void;
};
interface IUseComplexSizeEditor {
    value: TValue;
    activeSizeTypes: SizeType[];
    inactiveSizeTypes: SizeType[];
    isAspectRatioEnabled: boolean;
    isAspectRatioShown: boolean;
    changeSizeHandler: (type: SizeType, sizeValue: string) => void;
    addSizeHandler: (type: SizeType) => void;
    delSizeHandler: (type: SizeType) => void;
    toggleAspectRatio: () => void;
}

const checkAvailableSizeType = (type: SizeType, metaType?: ObjectMeta<TValue>): boolean => {
    const metaProperties = metaType?.getProperties();

    return !!metaProperties && type in metaProperties && metaProperties[type]?.isVisible();
};

export const useComplexSizeEditor = (props: TUseComplexSizeEditorProps): IUseComplexSizeEditor => {
    const { value, metaType, onChange } = props;

    const metaProperties = metaType?.getProperties();
    const availableLimitedSizeTypes = useMemo(
        () => LIMIT_SIZE_TYPES.filter((type) => checkAvailableSizeType(type, metaType)),
        [metaType]
    );
    const availableBaseSizeTypes = useMemo(
        () => BASE_SIZE_TYPES.filter((type) => checkAvailableSizeType(type, metaType)),
        [metaType]
    );
    const [limitedSizes, setLimitedSizes] = useState<
        Omit<TValue, 'width' | 'height' | 'aspectRatio'>
    >(() => {
        return availableLimitedSizeTypes.reduce((acc, sizeType) => {
            if (!(sizeType in value)) return acc;

            return { ...acc, [sizeType]: value[sizeType] };
        }, {});
    });
    const activeSizeTypes = useMemo(
        () => [...availableBaseSizeTypes, ...Object.keys(limitedSizes)],
        [limitedSizes]
    );

    const inactiveSizeTypes = useMemo(
        () => availableLimitedSizeTypes.filter((sizeType) => !activeSizeTypes.includes(sizeType)),
        [availableLimitedSizeTypes, activeSizeTypes]
    );

    // костыли, кажется
    const editorValue = useMemo(
        () => ({
            width: value?.width || '',
            height: value?.height || '',
            // возмжно плохая история с || 0
            aspectRatio: value?.aspectRatio || 0,
            ...limitedSizes,
        }),
        [value?.width, value?.height, value?.aspectRatio, limitedSizes]
    );
    const changeLimitedSizes = useCallback((newValue: Partial<TValue>) => {
        const { width, height, aspectRatio, ...newLimitedSizes } = newValue;

        setLimitedSizes(newLimitedSizes);
    }, []);

    const addSizeHandler = useCallback(
        (sizeType: SizeType) => {
            const sizeMeta = metaProperties?.[sizeType];

            if (!sizeMeta) return;

            const newValue = changeSize(sizeType, '', editorValue);

            changeLimitedSizes(newValue);
        },
        [editorValue, metaProperties]
    );
    // сейчас можно удалить базовый размер, может надо проверку
    const delSizeHandler = useCallback(
        (sizeType: SizeType) => {
            if (checkIsBaseSize(sizeType)) return;

            const { [sizeType]: delSizeType, ...newValue } = editorValue;
            // @ts-ignore
            const { [sizeType]: delLimitedSizeType, ...newLimitedSizes } = limitedSizes;

            changeLimitedSizes(newLimitedSizes);
            onChange?.(newValue);
        },
        [editorValue, onChange]
    );

    const changeSizeHandler = useCallback(
        (type: SizeType, sizeValue: string) => {
            if (!sizeValue && !checkIsBaseSize(type)) return delSizeHandler(type);

            const newValue = changeSize(type, sizeValue, editorValue);

            onChange?.(newValue);
            changeLimitedSizes(newValue);
        },
        [editorValue, onChange]
    );

    const isAspectRatioEnabled = !!editorValue?.aspectRatio;
    const isAspectRatioShown = useMemo(() => {
        const { width, height } = editorValue;

        const parsedWidth = parseStyleValue(width);
        const parsedHeight = parseStyleValue(height);

        if (!parsedWidth || !parsedHeight) return false;

        return metaProperties?.aspectRatio?.getDefaultValue() !== void 0;
    }, [metaProperties?.aspectRatio, editorValue?.width, editorValue?.height]);
    const toggleAspectRatio = useCallback(() => {
        if (!editorValue) return;

        if (editorValue.aspectRatio) return onChange?.({ ...editorValue, aspectRatio: 0 });

        const defaultAspectRatio = metaType?.getProperties().aspectRatio.getDefaultValue();

        if (defaultAspectRatio === void 0) return;

        // hack with || 1 - need fix
        const newValue = changeAspectRatio(defaultAspectRatio || 1, editorValue);

        onChange?.(newValue);
        changeLimitedSizes(newValue);

        return;
    }, [editorValue, onChange, metaType]);

    return {
        value: editorValue,
        activeSizeTypes,
        inactiveSizeTypes,
        isAspectRatioEnabled,
        isAspectRatioShown,
        changeSizeHandler,
        addSizeHandler,
        delSizeHandler,
        toggleAspectRatio,
    };
};
