import { IPropertyGrid } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef, useMemo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';
import { isRecordValue, RecordAdapter } from './_adapter/RecordAdapter';
import { Record } from 'Types/entity';
import { useSystemProperties } from './SystemProperties';
import { GroupCloudView } from './GroupCloudView';

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
    const { metaType, sort, value, onChange, captionColumnWidth, storeId, groupType } = props;
    const isValueRecord = isRecordValue(value);
    const recordVersion = isValueRecord ? (value as Record).getVersion() : undefined;
    const validationContainerRef = useRef<ValidationController>(null);
    const [preparedMeta, expandSystemValue, foldSystemValue] =
        useSystemProperties<RuntimeInterface>(metaType);

    const preparedValue = useMemo(() => {
        if (value === undefined) {
            return value;
        }

        let prepared = value;

        if (isValueRecord && recordVersion !== undefined) {
            const adapter = new RecordAdapter(value, preparedMeta);
            prepared = adapter.get() as RuntimeInterface;
        }

        return expandSystemValue(prepared);
    }, [value, isValueRecord, recordVersion, expandSystemValue, preparedMeta]);

    const preparedOnChange = useCallback(
        (newValue: RuntimeInterface) => {
            validationContainerRef.current?.submit();
            let prepared = newValue;

            if (isValueRecord) {
                const adapter = new RecordAdapter(value, preparedMeta);
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
                />
            </div>
        </ValidationController>
    );
});

export default memo(PropertyGrid);
