/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
export const PROPERTY_NAME_FIELD: string = 'name';
export const PROPERTY_GROUP_FIELD: string = 'group';
export const PROPERTY_VALUE_FIELD: string = 'propertyValue';
export const PROPERTY_TOGGLE_BUTTON_ICON_FIELD: string = 'toggleEditorButtonIcon';
export const DEFAULT_VALIDATOR_TEMPLATE: string = 'Controls/validate:Container';
export const DEFAULT_EDITORS = {
    string: 'Controls/propertyGrid:StringEditor',
    boolean: 'Controls/propertyGrid:BooleanEditor',
    number: 'Controls/propertyGrid:NumberEditor',
    text: 'Controls/propertyGrid:TextEditor',
    enum: 'Controls/propertyGrid:EnumEditor',
    date: 'Controls/propertyGrid:DateEditor',
};
export const DEFAULT_VALIDATORS_BY_TYPE = {
    enum: 'Controls/validate:SelectionContainer',
    string: 'Controls/validate:InputContainer',
    text: 'Controls/validate:InputContainer',
    number: 'Controls/validate:InputContainer',
    date: 'Controls/validate:InputContainer',
    time: 'Controls/validate:InputContainer',
};
export const EDIT_IN_PLACE_CANCEL = 'Cancel';
