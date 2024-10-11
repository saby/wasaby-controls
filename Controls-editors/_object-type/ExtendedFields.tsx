import { Button as ButtonControl } from 'Controls/buttons';
import 'css!Controls-editors/_object-type/ExtendedFields';
import TypeHierarchyPadding from 'Controls-editors/_object-type/TypeHierarchyPadding';

export interface IExtendedFieldOption {
    title: string;
    id: string;
    disabled: boolean;
}

type ExtendedFieldsProps = {
    fields: IExtendedFieldOption[];
    onClickField: (fieldId: string) => void;
};

function ExtendedFields(props: ExtendedFieldsProps) {
    const { fields, onClickField } = props;

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
                        <ButtonControl
                            viewMode="filled"
                            caption={field.title}
                            onClick={() => onClickField(field.id)}
                            className="controls-PropertyGrid__extended_field"
                            buttonStyle="pale"
                            key={field.id}
                        />
                    ))}
            </div>
        </div>
    );
}

export default ExtendedFields;
