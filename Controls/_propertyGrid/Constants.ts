/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
export const PROPERTY_NAME_FIELD: string = 'name';
export const PROPERTY_GROUP_FIELD: string = 'group';
export const PROPERTY_VALUE_FIELD: string = 'propertyValue';
export const PROPERTY_TOGGLE_BUTTON_ICON_FIELD: string = 'toggleEditorButtonIcon';
export const DEFAULT_VALIDATOR_TEMPLATE: string = 'Controls/validate:Container';
export const DEFAULT_EDITORS = {
    string: 'Controls/propertyGridEditors:String',
    boolean: 'Controls/propertyGridEditors:Boolean',
    number: 'Controls/propertyGridEditors:Number',
    text: 'Controls/propertyGridEditors:Text',
    enum: 'Controls/propertyGridEditors:Enum',
    date: 'Controls/propertyGridEditors:Date',
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
