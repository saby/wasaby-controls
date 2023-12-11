import { Button as ButtonControl } from 'Controls/buttons';
import 'css!Controls-editors/_object-type/ExtendedFields';

export interface IExtendedFieldOption {
    title: string;
    id: string;
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
            {fields.map((field) => (
                <ButtonControl
                    viewMode="filled"
                    caption={field.title}
                    onClick={() => onClickField(field.id)}
                    className="controls-PropertyGrid__extended_field"
                    buttonStyle="pale"
                />
            ))}
        </div>
    );
}

export default ExtendedFields;
