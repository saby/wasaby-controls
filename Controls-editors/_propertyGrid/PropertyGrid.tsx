import { IPropertyGrid } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef, useMemo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';
import { isRecordValue, RecordAdapter } from './_adapter/RecordAdapter';
import { Record } from 'Types/entity';

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
    const { metaType, sort, value, onChange, captionColumnWidth, storeId } = props;
    const isValueRecord = isRecordValue(value);

    const recordVersion = isValueRecord ? (value as Record).getVersion() : undefined;

    const validationContainerRef = useRef<ValidationController>(null);

    const preparedValue = useMemo(() => {
        if (isValueRecord && recordVersion !== undefined) {
            const adapter = new RecordAdapter(value, metaType);
            return adapter.get();
        }

        return value;
    }, [value, recordVersion, isValueRecord, metaType]);

    const preparedOnChange = useCallback(
        (newValue: object) => {
            validationContainerRef.current?.submit();
            if (isValueRecord) {
                const adapter = new RecordAdapter(value, metaType);
                adapter.set(newValue);
                onChange(adapter.getRecord().clone());
            } else {
                onChange(newValue);
            }
        },
        [value, onChange, metaType, isValueRecord]
    );

    const setRefCallback = useCallback((node) => {
        validationContainerRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, []);

    return (
        <ValidationController name={'form'} ref={setRefCallback}>
            <div
                data-qa="controls_objectEditorGrid"
                className={`controls_PropertyGrid_objectEditorGrid ${props.className || ''}`}
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
                    metaType={metaType}
                    sort={sort}
                    value={preparedValue}
                    onChange={preparedOnChange}
                    EditorLayoutComponent={props.EditorLayoutComponent || PropertyGridEditorLayout}
                    GroupHeaderComponent={PropertyGridGroupHeader}
                />
            </div>
        </ValidationController>
    );
});

export default memo(PropertyGrid);
