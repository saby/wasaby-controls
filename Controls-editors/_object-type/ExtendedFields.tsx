import { Button } from 'Controls/buttons';
import 'css!Controls-editors/_object-type/ExtendedFields';
import TypeHierarchyPadding from 'Controls-editors/_object-type/TypeHierarchyPadding';
import { useCallback } from 'react';

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
                        <ChipsRender
                            id={field.id}
                            title={field.title}
                            onClick={onClickField}
                            key={field.id}
                        />
                    ))}
            </div>
        </div>
    );
}

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

export default ExtendedFields;
