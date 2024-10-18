import { useMemo, useCallback, useState, useEffect, Fragment } from 'react';
import {
    ArrayMeta,
    Meta,
    IComponent,
    IPropertyEditorProps,
    StringType,
    ObjectMeta,
} from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useEditorsLoader } from 'Controls-editors/objectEditorOpener';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { dateRangeData, minRangeData } from 'Controls-ListEnv-meta/DateRangeFilterItemType';
import { isEqual } from 'Types/object';
import {
    ARBITRARY_VALUE,
    getHiddenNodes,
    isMinRangeItem,
    removeMinRangeItem,
    removeAllRangeItem,
    isArbitraryValueHidden,
} from './DateRangeEditorHelpers';
import 'css!Controls-ListEnv-editors/dateRangeEditor';

interface IDateRangeEditorProps extends IPropertyEditorProps<object> {
    attributes: {
        dateRangeType: ArrayMeta<string[]>;
        defaultDateRange: Meta<string>;
        minRange: Meta<string>;
        type: Meta<string>;
        position: Meta<string>;
        arrows: Meta<boolean>;
    };
    value: {
        dateRangeType: string[];
        defaultDateRange: string;
        minRange: string;
        type: string;
        position: string;
        arrows: boolean;
    };
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    minRange: typeof StringType;
    metaTypeWithoutEditor: ObjectMeta<object, object>;
}

const options = [...dateRangeData, ...getHiddenNodes(minRangeData)];
const menuPopupOptions = {
    width: 198,
};

export default function DateRangeEditor(props: IDateRangeEditorProps): JSX.Element {
    const { dateRangeType, defaultDateRange } = props.attributes;
    const { value, onChange, LayoutComponent = Fragment, metaTypeWithoutEditor, minRange } = props;

    const [resultMeta, setResultMeta] = useState(metaTypeWithoutEditor);
    const [minRangeValue, setMinRangeValue] = useState(
        () => value?.minRange || (minRange?.getDefaultValue() as string)
    );
    const [dateRangeTypeValue, setDateRangeTypeValue] = useState(() => {
        const result = [...(value?.dateRangeType || dateRangeType.getDefaultValue())];
        if (result?.includes(ARBITRARY_VALUE) && !result.includes(minRangeValue)) {
            result.push(minRangeValue);
        }
        return result;
    });

    const defaultDateRangeValue = useMemo(() => {
        let result = value?.defaultDateRange || (defaultDateRange.getDefaultValue() as string);
        result = isArbitraryValueHidden(result, dateRangeTypeValue)
            ? dateRangeTypeValue[0]
            : result;
        return result;
    }, [defaultDateRange, value, dateRangeTypeValue]);
    const resultValue = useMemo(() => {
        return {
            ...value,
            dateRangeType: dateRangeTypeValue,
            defaultDateRange: defaultDateRangeValue,
            minRange: minRangeValue,
        };
    }, [dateRangeTypeValue, defaultDateRangeValue, minRangeValue, value]);

    const menuBeforeSelectionChangedCallback = useCallback(
        // TODO: https://online.sbis.ru/opendoc.html?guid=4948b8e8-14da-44d7-9953-345e6020d05b&client=3
        // изменяем выбранные ключи, нужно для корректной работы с произвольным периодом
        (selection) => {
            // если выбрали произвольный период, то добавляем минимальны период
            if (selection.selectedKeysDifference.added[0] === ARBITRARY_VALUE) {
                return {
                    selected: [...selection.selectedKeysDifference.keys, minRangeValue],
                    excluded: [],
                };
            } else if (selection.selectedKeysDifference.removed[0] === ARBITRARY_VALUE) {
                // если удалили произвольный период, то удаляем минимальны период
                return {
                    selected: removeMinRangeItem(selection.selectedKeysDifference.keys),
                    excluded: [],
                };
            } else if (isMinRangeItem(selection.selectedKeysDifference.added[0])) {
                // обработка выбора минимального периода
                const selected = removeMinRangeItem(selection.selectedKeysDifference.keys);
                return {
                    selected: [...selected, selection.selectedKeysDifference.added[0]],
                    excluded: [],
                };
            }
        },
        [minRangeValue]
    );

    const loadAndSetMetaType = useCallback((newMetaType) => {
        Promise.all([
            newMetaType.getProperties().dateRangeType.getEditor().load(),
            newMetaType.getProperties().defaultDateRange.getEditor().load(),
            newMetaType.getProperties().type.getEditor().loader(),
            newMetaType.getProperties().arrows.getEditor().loader(),
            newMetaType.getProperties().position.getEditor().loader(),
        ]).then(() => {
            setResultMeta(newMetaType);
        });
    }, []);

    const calculateDateRangeTypes = useCallback(
        (newDateRangeTypeValue, newMinRangeValue) => {
            const attributes = resultMeta?.getProperties();
            const resultOptions = value.arrows
                ? options.filter((option) => option.value !== 'all')
                : options;
            const newDateRangeType = attributes.dateRangeType.editorProps({
                options: resultOptions.map((option) => {
                    return option.value === ARBITRARY_VALUE
                        ? {
                              ...option,
                              minRangeType: minRange,
                              minRangeValue: newMinRangeValue,
                              type: value.type,
                          }
                        : option;
                }),
                menuPopupOptions,
                itemTemplate:
                    'Controls-ListEnv-editors/dateRangeEditor:DateRangeEditorItemTemplate',
                menuBeforeSelectionChangedCallback,
                type: value.type,
                emptyKey: null,
                emptyText: null,
            });
            const newDefaultDateRange = attributes.defaultDateRange.editorProps({
                options: resultOptions.filter((option) => {
                    return (
                        newDateRangeTypeValue.includes(option.value) &&
                        !isMinRangeItem(option.value) &&
                        (option.value !== ARBITRARY_VALUE ||
                            !isArbitraryValueHidden(option.value, newDateRangeTypeValue))
                    );
                }),
            });
            return {
                dateRangeType: newDateRangeType,
                defaultDateRange: newDefaultDateRange,
            };
        },
        [value, menuBeforeSelectionChangedCallback, resultMeta, minRange]
    );

    const changeMetaTypes = useCallback(
        (newDateRangeTypeValue, newMinRangeValue) => {
            const attributes = resultMeta?.getProperties();
            const dateRangeTypes = calculateDateRangeTypes(newDateRangeTypeValue, newMinRangeValue);
            const newMetaType = resultMeta?.properties({
                ...attributes,
                defaultDateRange: dateRangeTypes.defaultDateRange,
                dateRangeType: dateRangeTypes.dateRangeType,
                minRange: minRange.hidden(),
            });
            loadAndSetMetaType(newMetaType);
        },
        [resultMeta, loadAndSetMetaType, calculateDateRangeTypes, minRange]
    );

    const changeDateRangeTypeEditorOptions = useCallback(
        (type) => {
            const attributes = resultMeta?.getProperties();
            const dateRangeTypes = calculateDateRangeTypes(dateRangeTypeValue, minRangeValue);
            const dateRangeMetaType = dateRangeTypes.dateRangeType;
            const editorProps = dateRangeMetaType.getEditor()?.props;
            const newDateRangeType = dateRangeMetaType.editorProps({
                ...editorProps,
                type,
                options: editorProps.options.map((option) => {
                    return { ...option, type };
                }),
            });
            const newMetaType = resultMeta?.properties({
                ...attributes,
                defaultDateRange: dateRangeTypes.defaultDateRange,
                dateRangeType: newDateRangeType,
                minRange: minRange.hidden(),
            });
            loadAndSetMetaType(newMetaType);
        },
        [
            resultMeta,
            loadAndSetMetaType,
            calculateDateRangeTypes,
            dateRangeTypeValue,
            minRangeValue,
            minRange,
        ]
    );

    useEffect(() => {
        changeMetaTypes(dateRangeTypeValue, minRangeValue);
    }, [value.arrows]);

    useEffect(() => {
        changeDateRangeTypeEditorOptions(value.type);
    }, [value.type]);

    const onDateRangeValueChange = useCallback(
        (newDateRangeValue) => {
            let resultDateRangeValue = newDateRangeValue;
            if (typeof newDateRangeValue === 'undefined') {
                resultDateRangeValue = dateRangeType.getDefaultValue();
            } else if (newDateRangeValue?.length === 1 && isMinRangeItem(newDateRangeValue[0])) {
                resultDateRangeValue = [
                    ...removeMinRangeItem(dateRangeTypeValue),
                    ...newDateRangeValue,
                ];
            } else if (!newDateRangeValue?.length) {
                resultDateRangeValue = value.arrows === true ? ['month'] : ['all'];
            }
            const newDateRangeType = removeMinRangeItem(resultDateRangeValue);
            let newDefaultDateRangeValue = resultDateRangeValue.includes(defaultDateRangeValue)
                ? defaultDateRangeValue
                : resultDateRangeValue[0];
            newDefaultDateRangeValue = isArbitraryValueHidden(
                newDefaultDateRangeValue,
                resultDateRangeValue
            )
                ? resultDateRangeValue[0]
                : newDefaultDateRangeValue;
            const newMinRangeValue =
                resultDateRangeValue?.find((range) => isMinRangeItem(range)) || minRangeValue;
            setDateRangeTypeValue(resultDateRangeValue);
            setMinRangeValue(newMinRangeValue);
            changeMetaTypes(newDateRangeType, newMinRangeValue);

            onChange({
                ...value,
                dateRangeType: newDateRangeType,
                defaultDateRange: newDefaultDateRangeValue,
                minRange: resultDateRangeValue.includes(ARBITRARY_VALUE) ? newMinRangeValue : null,
            });
        },
        [
            defaultDateRangeValue,
            onChange,
            minRangeValue,
            dateRangeTypeValue,
            changeMetaTypes,
            dateRangeType,
            value,
        ]
    );
    const onArrowsChange = useCallback(
        (newArrows) => {
            let resultDateRangeType = removeMinRangeItem(dateRangeTypeValue);
            resultDateRangeType = newArrows
                ? removeAllRangeItem(resultDateRangeType)
                : resultDateRangeType;
            onChange({
                ...value,
                dateRangeType: resultDateRangeType,
                defaultDateRange:
                    newArrows && defaultDateRangeValue === 'all'
                        ? resultDateRangeType[0]
                        : defaultDateRangeValue,
                arrows: newArrows,
            });
        },
        [dateRangeTypeValue, value, onChange, defaultDateRangeValue]
    );

    const onValueChange = useCallback(
        (newValue) => {
            if (!isEqual(newValue?.dateRangeType, dateRangeTypeValue)) {
                onDateRangeValueChange(newValue?.dateRangeType);
            } else if (newValue?.arrows !== value?.arrows) {
                onArrowsChange(newValue?.arrows);
            } else {
                onChange({
                    ...value,
                    dateRangeType: removeMinRangeItem(dateRangeTypeValue),
                    type: newValue.type,
                    position: newValue.position,
                    defaultDateRange: newValue.defaultDateRange,
                });
            }
        },
        [dateRangeTypeValue, onDateRangeValueChange, onArrowsChange, onChange, value]
    );

    const canShowEditors = useEditorsLoader(resultMeta);

    if (!canShowEditors) {
        return (
            <LayoutComponent title={''}>
                <div className="DateRangeEditor"></div>
            </LayoutComponent>
        );
    }

    return (
        <LayoutComponent title={''}>
            <div className="DateRangeEditor">
                <PropertyGrid
                    metaType={resultMeta}
                    value={resultValue}
                    onChange={onValueChange}
                    captionColumnWidth="40%"
                />
            </div>
        </LayoutComponent>
    );
}
