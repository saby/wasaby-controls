import { IPropertyGrid } from './IPropertyGrid';
import { memo, useCallback, forwardRef, useRef } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';
import { Controller as ValidationController } from 'Controls/validate';

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @public
 * @class Controls-editors/_propertyGrid/PropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/BaseEditorsGrid/Index
 * @mixes Controls-editors/object-type:IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @author Парамонов В.С.
 */
const PropertyGrid = forwardRef(function PropertyGrid<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface> & { className?: string },
    ref
) {
    const { metaType, sort, value, onChange, captionColumnWidth } = props;

    const validationContainerRef = useRef<ValidationController>(null);

    const setRefCallback = useCallback((node) => {
        validationContainerRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, []);

    const preparedOnChange = useCallback(
        (value: RuntimeInterface) => {
            // TODO: пока не дожидаемся промиса, а только подсвечиваем что значение не валидно.
            // т.к. не валидное значение не должно порождать вызова onChange.
            // Чтобы такое организовать, нужно вводить локальный стейт вокруг каждого редактора
            validationContainerRef.current?.submit();
            onChange(value);
        },
        [onChange]
    );

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
                    metaType={metaType}
                    sort={sort}
                    value={value}
                    onChange={preparedOnChange}
                    EditorLayoutComponent={props.EditorLayoutComponent || PropertyGridEditorLayout}
                    GroupHeaderComponent={PropertyGridGroupHeader}
                />
            </div>
        </ValidationController>
    );
});

export default memo(PropertyGrid);
