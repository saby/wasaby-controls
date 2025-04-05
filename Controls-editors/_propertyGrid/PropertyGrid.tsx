import { IPropertyGrid, IPropertyGridByStoreProps, IPropertyGridProps } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef, useMemo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import {
    ObjectTypeEditor,
    PropsValidation,
    PROPERTY_GRID_OBJECT_SLICE_NAME,
    ObjectTypeSlice,
} from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';
import { isRecordValue, RecordAdapter, getRecordAsObject } from './_adapter/RecordAdapter';
import { Record as EntityRecord } from 'Types/entity';
import { useSystemProperties } from './SystemProperties';
import { GroupCloudView } from './GroupCloudView';
import { ColorSchemeContextProvider } from './ColorSchemeContext';
import { WasabyContextManager } from 'UICore/Contexts';
import { Provider, useStrictSlice } from 'Controls-DataEnv/context';

function useRecordValue<T extends object = object>(
    value: EntityRecord | T | undefined
): [T | undefined, boolean] {
    const isValueRecord = isRecordValue(value);
    const recordVersion = isValueRecord ? (value as EntityRecord).getVersion() : undefined;

    const result = useMemo(() => {
        if (isValueRecord && recordVersion !== undefined) {
            return getRecordAsObject(value as EntityRecord) as T;
        }

        return value as T;
    }, [isValueRecord, recordVersion, value]);

    return [result, isValueRecord];
}

const config = {
    [PROPERTY_GRID_OBJECT_SLICE_NAME]: {
        dataFactoryName: 'Controls-DataEnv/dataFactory:Form',
        dataFactoryArguments: {
            id: 1,
        },
    },
};

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @public
 * @class Controls-editors/_propertyGrid/PropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/BaseEditorsGrid/Index
 * @mixes Controls-editors/object-type:IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @author Терентьев Е.С.
 */
export const PropertyGrid = forwardRef(function PropertyGrid(props: IPropertyGrid, ref) {
    if (!!props.storeId) {
        return <PropertyGridByStore {...(props as IPropertyGridByStoreProps)} ref={ref} />;
    }
    return <PropertyGridByProps {...(props as IPropertyGridProps)} ref={ref} />;
});

export const PropertyGridByProps = memo(
    forwardRef(function PropertyGridByProps(props: IPropertyGridProps, ref) {
        const {
            value,
            onChange,
            captionColumnWidth,
            groupType,
            validation,
            validationControllerClass,
            readOnly,
            metaType,
            storeId,
            colorScheme,
        } = props;
        const validationContainerRef = useRef<ValidationController>(null);

        const [preparedMeta, expandSystemValue, foldSystemValue] = useSystemProperties(metaType);

        const [objectValue, isValueRecord] = useRecordValue(value);
        const [objectValidation] = useRecordValue<PropsValidation>(validation);

        const preparedValue = useMemo(() => {
            if (objectValue !== undefined) {
                return expandSystemValue(objectValue);
            }

            return objectValue;
        }, [objectValue, expandSystemValue]);

        const preparedOnChange = useCallback(
            (newValue: object) => {
                let prepared = newValue;
                validationContainerRef.current?.submit({
                    activateInput: false,
                });

                if (isValueRecord) {
                    const adapter = new RecordAdapter(value as EntityRecord, preparedMeta);
                    adapter.set(newValue);
                    prepared = adapter.getRecord().clone();
                }

                prepared = foldSystemValue(prepared);
                onChange(prepared);
            },
            [isValueRecord, foldSystemValue, onChange, value, preparedMeta]
        );

        const setRefCallback = useCallback((node) => {
            validationContainerRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        }, []);

        const contextData = useMemo(() => {
            let valueAsRecord: EntityRecord;
            if (isValueRecord) {
                valueAsRecord = value as EntityRecord;
            } else {
                valueAsRecord = new EntityRecord({
                    rawData: value,
                });
            }
            return {
                [PROPERTY_GRID_OBJECT_SLICE_NAME]: valueAsRecord,
            };
        }, [isValueRecord, value]);

        const initClassName = groupType
            ? 'controls_PropertyGrid_objectEditorGrid-withGroups'
            : 'controls_PropertyGrid_objectEditorGrid';

        const groupComponent = groupType === 'cloud' ? GroupCloudView : undefined;

        const content = (
            <Provider configs={config} loadResults={contextData}>
                <ObjectTypeEditor
                    storeId={storeId}
                    metaType={preparedMeta}
                    value={preparedValue}
                    onChange={preparedOnChange}
                    EditorLayoutComponent={PropertyGridEditorLayout}
                    GroupHeaderComponent={PropertyGridGroupHeader}
                    GroupComponent={groupComponent}
                    showTooltip={props.showTooltip}
                    validation={objectValidation}
                />
            </Provider>
        );
        const result = (
            <ValidationController
                name={'form'}
                ref={setRefCallback}
                validateController={validationControllerClass}
            >
                <div
                    data-qa="controls_objectEditorGrid"
                    className={`${initClassName} ${props.className || ''}`}
                    style={
                        captionColumnWidth
                            ? {
                                  gridTemplateColumns: `auto ${captionColumnWidth} minmax(50%, 1fr)`,
                              }
                            : undefined
                    }
                >
                    {colorScheme ? (
                        <ColorSchemeContextProvider colorScheme={colorScheme}>
                            {content}
                        </ColorSchemeContextProvider>
                    ) : (
                        content
                    )}
                </div>
            </ValidationController>
        );

        if (readOnly !== undefined) {
            return <WasabyContextManager readOnly={readOnly}>{result}</WasabyContextManager>;
        }

        return result;
    })
);

const PropertyGridByStore = function PropertyGridByStore(props: IPropertyGridByStoreProps) {
    const slice = useStrictSlice<ObjectTypeSlice>(props.storeId);

    return <PropertyGridByProps {...props} metaType={slice.state.metaType} />;
};
