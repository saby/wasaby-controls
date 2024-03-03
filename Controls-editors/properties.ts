/**
 * Properties library
 * @library Controls-editors/properties
 * @includes FontEditor Controls-editors/_properties/FontEditor
 * @includes NumberEditor Controls-editors/_properties/NumberEditor
 * @includes ObjectEditor Controls-editors/_properties/ObjectEditor
 * @includes SizeEditor Controls-editors/_properties/SizeEditor
 * @includes StringEditor Controls-editors/_properties/StringEditor
 * @includes StyleEditor Controls-editors/_properties/StyleEditor
 * @includes NameEditor Controls-editors/_properties/NameEditor
 * @author Парамонов В.С.
 * @public
 */

export { IBasePropertyEditorProps } from './_properties/BasePropertyEditorProps';
export { EnumComboboxEditor } from './_properties/EnumComboboxEditor';
export { ComboboxEditor } from './_properties/ComboboxEditor';
export { TreeEditor, ITreeEditorProps } from './_properties/TreeEditor';
export { FontEditor, IFont, IFontEditorProps } from './_properties/FontEditor';
export { ObjectEditor } from './_properties/ObjectEditor';
export { SizeEditor } from './_properties/SizeEditor';
export { SizeObjectEditor } from './_properties/SizeObjectEditor';
export { LookupEditor } from './_properties/LookupEditor';
export { NameEditor } from './_properties/NameEditor';
export { default as NameEditorPopup } from './_properties/NameEditor/NameEditorPopup';
export { TimeEditor, IDateEditorProps } from './_properties/TimeEditor';
export { DateRangeEditor, IDateRangeEditorProps } from './_properties/DateRangeEditor';
export { LimitDateEditor, ILimitDateEditorProps } from './_properties/LimitDateEditor';
export { LimitTimeEditor, ILimitTimeEditorProps } from './_properties/LimitTimeEditor';
export { VisibleItemsCountEditor } from './_properties/VisibleItemsCountEditor';
export { IconEditor } from './_properties/IconEditor/IconEditor';
export { default as IconEditorPopup } from './_properties/IconEditor/IIconEditorPopup';
export { DataMapTree } from 'Controls-editors/_properties/NameEditor/DataMapTree';
export { DataMapTreeEmptyTemplate } from 'Controls-editors/_properties/NameEditor/DataMapTreeEmptyTemplate';
export { default as FieldListFactory } from 'Controls-editors/_properties/NameEditor/dataFactory/FieldsListFactory';
export {
    IFieldItem,
    IFieldsSearch,
} from 'Controls-editors/_properties/NameEditor/dataFactory/FieldsSource';
export { BackgroundEditor, IBackgroundEditorProps } from './_properties/BackgroundEditor';
export { RoundBorderEditor } from './_properties/RoundBorderEditor';
export { NameEditor as ConnectedNameEditor } from 'Controls-editors/_properties/NameEditor/NameEditor';
