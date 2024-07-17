import {
    BaseEditor,
    IEditingValue,
} from 'Controls-Lists-editors/_columnsEditor/editorClasses/base';
import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { FOLDER_DEFAULT_PARAMS } from 'Controls-Lists-editors/_columnsEditor/constants';
import { BooleanType, ObjectType, StringType, group } from 'Meta/types';
import {
    alignEditorIconOptions,
    alignEditorOptions,
} from 'Controls-Lists-editors/_columnsEditor/utils/meta';
import * as rk from 'i18n!Controls-Lists-editors';
import { ITreeControlItem } from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import { TColumnsForCtor } from 'Controls/baseGrid';

export class FolderEditor extends BaseEditor {
    protected _loadData: object;
    protected _loadConfig: object;
    protected _treeItems: ITreeControlItem[];
    protected _unusedColumns: TColumnsForCtor;
    protected _currentItem: ITreeControlItem;
    protected _emptyFolders: ITreeControlItem[];
    protected _rootKey: number | string;
    constructor(
        markupValue: IMarkupValue,
        loadData?: object,
        loadConfig?: object,
        treeItems?: ITreeControlItem[],
        rootKey?: number | string,
        unusedColumns?: TColumnsForCtor,
        emptyFolders?: ITreeControlItem[]
    ) {
        super();
        if (loadConfig) {
            this._loadConfig = loadConfig;
        }
        if (loadData) {
            this._loadData = loadData;
        }
        if (treeItems) {
            this._treeItems = treeItems;
        }
        if (unusedColumns) {
            this._unusedColumns = unusedColumns;
        }
        if (emptyFolders) {
            this._emptyFolders = emptyFolders;
        }
        if (rootKey) {
            this._rootKey = rootKey;
        }
        this._value = {
            caption:
                markupValue.caption === FOLDER_DEFAULT_PARAMS.caption ? '' : markupValue.caption,
            textOverflow: !markupValue.textOverflow
                ? true
                : markupValue.textOverflow === FOLDER_DEFAULT_PARAMS.textOverflow,
            align: markupValue.align ?? FOLDER_DEFAULT_PARAMS.align,
            subTree: undefined,
        };
    }
    getMetaType(): object {
        const loadData = this._loadData;
        const loadConfig = this._loadConfig;
        const treeItems = this._treeItems;
        const unusedColumns = this._unusedColumns;
        const emptyFolders = this._emptyFolders;
        const rootKey = this._rootKey;
        const baseType = {
            caption: StringType.id('caption')
                .title(rk('Название'))
                .order(-1)
                .editor('Controls-Lists-editors/columnsEditor:ColumnCaptionEditor', {
                    placeholder: rk(FOLDER_DEFAULT_PARAMS.caption),
                })
                .defaultValue(''),
            ...group('', {
                textOverflow: BooleanType.title(rk('Перенос строк'))
                    .editor('Controls-editors/toggle:SwitchEditor')
                    .optional()
                    .order(1)
                    .defaultValue(true),
                align: StringType.title(rk('Выравнивание'))
                    .editor('Controls-editors/toggle:TumblerEditor', {
                        options: alignEditorIconOptions,
                    })
                    .oneOf(alignEditorOptions)
                    .optional()
                    .defaultValue('center')
                    .order(2),
            }),
        };
        const treeType = treeItems
            ? {
                  ...group('', {
                      subTree: StringType.id('')
                          .title('')
                          .optional()
                          .order(3)
                          .editor('Controls-Lists-editors/columnsEditor:SubTree', {
                              loadData,
                              loadConfig,
                              treeItems,
                              unusedColumns,
                              emptyFolders,
                              rootKey,
                          }),
                  }),
              }
            : {};
        return {
            ...baseType,
            ...treeType,
        };
    }
    updateValue(oldValue: IMarkupValue, newProperties: IEditingValue): IMarkupValue {
        const result: IMarkupValue = { ...oldValue };
        // Заголовок
        if (newProperties.caption) {
            // Если ввели свой заголовок
            result.caption = newProperties.caption;
        } else if (newProperties.caption === undefined) {
            // Если сбросили до значения по умолчанию
            result.caption = FOLDER_DEFAULT_PARAMS.caption;
        }
        // Перенос строк
        if (newProperties.textOverflow !== undefined) {
            result.textOverflow = !newProperties.textOverflow ? 'ellipsis' : 'none';
        } else {
            result.textOverflow = FOLDER_DEFAULT_PARAMS.textOverflow;
        }
        // Выравнивание
        if (newProperties.align !== undefined) {
            result.align = newProperties.align;
        } else {
            result.align = FOLDER_DEFAULT_PARAMS.align;
        }
        return result;
    }
}
