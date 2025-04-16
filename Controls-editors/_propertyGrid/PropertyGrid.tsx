import { IPropertyGrid, IPropertyGridByStoreProps, IPropertyGridProps } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef, useMemo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import {
    ObjectTypeEditor,
    ObjectTypeEditorNew,
    PropsValidation,
    PROPERTY_GRID_OBJECT_SLICE_NAME,
    ObjectTypeSlice,
    GroupComponent,
} from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';
import { Record as EntityRecord } from 'Types/entity';
import { useSystemProperties } from './SystemProperties';
import { GroupCloudView } from './GroupCloudView';
import { ColorSchemeContextProvider } from './ColorSchemeContext';
import { WasabyContextManager } from 'UICore/Contexts';
import { Provider, useStrictSlice } from 'Controls-DataEnv/context';
import { useRecordValue } from './useRecordValue';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';

const config: Record<string, IDataConfig> = {
    [PROPERTY_GRID_OBJECT_SLICE_NAME]: {
        dataFactoryName: 'Controls-DataEnv/dataFactory:Form',
        dataFactoryArguments: {
            id: 1,
        } as any,
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

        const [objectValue, getRecord, isValueRecord] = useRecordValue(value);
        const [objectValidation] = useRecordValue<PropsValidation>(validation);

        const preparedValue = useMemo(() => {
            if (objectValue !== undefined) {
                return expandSystemValue(objectValue);
            }

            return {};
        }, [objectValue, expandSystemValue]);

        const preparedOnChange = useCallback(
            (newValue: object) => {
                let prepared = newValue;
                validationContainerRef.current?.submit({
                    activateInput: false,
                });

                prepared = foldSystemValue(prepared);
                prepared = getRecord(prepared, preparedMeta);

                onChange(prepared);
            },
            [foldSystemValue, getRecord, preparedMeta, onChange]
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

        let content = !!storeId ? (
            <ObjectTypeEditorNew
                storeId={storeId}
                metaType={preparedMeta}
                value={preparedValue}
                onChange={preparedOnChange}
                EditorLayoutComponent={PropertyGridEditorLayout}
                GroupComponent={groupComponent ?? GroupComponent}
                showTooltip={props.showTooltip}
                validation={objectValidation}
            />
        ) : (
            <ObjectTypeEditor
                storeId={undefined}
                metaType={preparedMeta}
                value={preparedValue}
                onChange={preparedOnChange}
                EditorLayoutComponent={PropertyGridEditorLayout}
                GroupHeaderComponent={PropertyGridGroupHeader}
                GroupComponent={groupComponent}
                showTooltip={props.showTooltip}
                validation={objectValidation}
            />
        );
        content = (
            <Provider configs={config} loadResults={contextData}>
                {content}
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

    return <PropertyGridByProps {...props} metaType={props.metaType ?? slice.state.metaType} />;
};
