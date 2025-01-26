import { IPropertyGrid } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef, useMemo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor, PropsValidation } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';
import { isRecordValue, RecordAdapter, getRecordAsObject } from './_adapter/RecordAdapter';
import { Record as EntityRecord } from 'Types/entity';
import { useSystemProperties } from './SystemProperties';
import { GroupCloudView } from './GroupCloudView';

function useRecordValue<T extends object>(
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

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @public
 * @class Controls-editors/_propertyGrid/PropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/BaseEditorsGrid/Index
 * @demo Controls-editors-demo/PropertyGrid/RecordPropertyGrid/Index
 * @mixes Controls-editors/object-type:IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @author Терентьев Е.С.
 */
const PropertyGrid = forwardRef(function PropertyGrid<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface>,
    ref
) {
    const { metaType, sort, value, onChange, captionColumnWidth, storeId, groupType, validation } =
        props;
    const validationContainerRef = useRef<ValidationController>(null);
    const [preparedMeta, expandSystemValue, foldSystemValue] =
        useSystemProperties<RuntimeInterface>(metaType);

    const [objectValue, isValueRecord] = useRecordValue<RuntimeInterface>(value);
    const [objectValidation] = useRecordValue<PropsValidation>(validation);

    const preparedValue = useMemo(() => {
        if (objectValue !== undefined) {
            return expandSystemValue(objectValue);
        }

        return objectValue;
    }, [objectValue, expandSystemValue]);

    const preparedOnChange = useCallback(
        (newValue: RuntimeInterface) => {
            let prepared = newValue;

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

    const initClassName = groupType
        ? 'controls_PropertyGrid_objectEditorGrid-withGroups'
        : 'controls_PropertyGrid_objectEditorGrid';

    const groupComponent = groupType === 'cloud' ? GroupCloudView : undefined;
    return (
        <ValidationController name={'form'} ref={setRefCallback}>
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
                <ObjectTypeEditor
                    storeId={storeId}
                    metaType={preparedMeta}
                    sort={sort}
                    value={preparedValue}
                    onChange={preparedOnChange}
                    EditorLayoutComponent={props.EditorLayoutComponent || PropertyGridEditorLayout}
                    GroupHeaderComponent={PropertyGridGroupHeader}
                    GroupComponent={groupComponent}
                    showTooltip={props.showTooltip}
                    validation={objectValidation}
                />
            </div>
        </ValidationController>
    );
});

export default memo(PropertyGrid);
