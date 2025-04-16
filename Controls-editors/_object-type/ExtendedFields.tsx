import { Button } from 'Controls/buttons';
import 'css!Controls-editors/object-type';
import TypeHierarchyPadding from './TypeHierarchyPadding';
import { useCallback, useContext, createContext } from 'react';
import { ObjectTypeEditorRootContext } from './Contexts';

export interface IExtendedFieldOption {
    title: string;
    id: string;
    disabled: boolean;
    groupId: string | undefined;
}

export interface IExtendedFieldsContext {
    fields: IExtendedFieldOption[];
}

/**
 * Контекст доступа к списку полей, которые скрыты по чипсам
 */
export const ExtendedFieldsContext = createContext<IExtendedFieldsContext>({
    fields: [],
});

/**
 * Компонент для отрисовки чипс с расширенными свойстами
 * @param props
 * @constructor
 */
export const ExtendedFields = function ExtendedFields() {
    const { fields } = useContext(ExtendedFieldsContext);

    const { showProperty } = useContext(ObjectTypeEditorRootContext);

    if (fields.filter((x) => !x.disabled).length === 0) {
        return null;
    }

    return (
        <div
            className="controls-PropertyGrid__extended_fields"
            data-qa="controls-PropertyGrid__extended_fields"
        >
            <TypeHierarchyPadding />
            <div className="controls-PropertyGrid__extended_fields-wrapper">
                <div className="controls-PropertyGrid__extended_fields-separator"></div>
                {fields
                    .filter(({ disabled }) => !disabled)
                    .map((field) => (
                        <ChipsRender
                            id={field.id}
                            title={field.title}
                            onClick={showProperty}
                            key={field.id}
                        />
                    ))}
            </div>
        </div>
    );
};

ExtendedFields.displayName = 'Controls-editors/object-type:ExtendedFields';

interface IChipsRenderProps {
    title: string;
    id: string;
    onClick(id: string): void;
}

function ChipsRender(props: IChipsRenderProps) {
    const { id, onClick } = props;

    const clickHandler = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <Button
            viewMode="filled"
            caption={props.title}
            onClick={clickHandler}
            className="controls-PropertyGrid__extended_field"
            buttonStyle="pale"
        />
    );
}
