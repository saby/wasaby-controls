import { IStepOptions } from 'Controls-Wizard/IStep';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Record } from 'Types/entity';
import { AreaSlice } from 'Controls-DataEnv/dataFactory';

/**
 * @typedef {Object} Controls-Wizard/_verticalNew/IWizard/IWizardItem
 * @property {string} title Заголовок шага
 * @property {string | TemplateFunction} headerContentTemplate Шаблон области с заголовком
 * @property {string | TemplateFunction} contentTemplate Шаблон шага
 * @property {Object} contentTemplateOptions Опции шаблона шага
 * @property {boolean} required Определяет, нужно ли заполнять данные в текущем шаге. По умолчанию true
 * @property {Record} record Данные для текущего шага
 */
export interface IWizardItem {
    /**
     * Заголовок шага
     */
    title: string;
    /**
     * Шаблон области с заголовком
     */
    headerContentTemplate: TemplateFunction | string;
    /**
     * Шаблон шага
     */
    contentTemplate?: TemplateFunction | string;
    /**
     * Опции шаблона шага
     */
    contentTemplateOptions?: object;
    /**
     * Определяет, нужно ли заполнять данные в текущем шаге.
     * @default true
     */
    required?: boolean;
    /**
     * Данные для текущего шага
     */
    record: Record;
}

export interface IWizardOptions extends IStepOptions, IControlOptions {
    /**
     * @cfg {Array<Controls-Wizard/_verticalNew/IWizard/IWizardItem.typedef>} Массив элементов для отображения
     * @example
     * В данном примере показано, как задавать элементы для отображения
     * WML:
     * <pre>
     *      <Controls-Wizard.VerticalNew
     *          items="{{_items}}"
     *          .../>
     * </pre>
     *
     * TS:
     * <pre>
     *      import {Control} from 'UI/Base';
     *      ...
     *
     *      export default class MyControl extends Control<MyControlOptions> {
     *          ...
     *              private _items: = [{
     *                  title: 'Проверка',
     *                  contentTemplate: 'MyModule/Check',
     *                  contentTemplateOptions: {
     *                      someOption: someValue
     *                  },
     *                  record: new Record({
     *                      rawData: {
     *                          name: '',
     *                          phone: '',
     *                          email: '',
     *                          company: '',
     *                          message: ''
     *                      }
     *                  })
     *              }, {
     *                  title: 'Отправка',
     *                  contentTemplate: 'MyModule/Send',
     *                  contentTemplateOptions: {
     *                      someOption: someValue
     *                  },
     *                  required: false,
     *                  record: new Record({
     *                      rawData: {
     *                          activate: false
     *                      }
     *                  })
     *              }, {
     *                  title: 'Результат',
     *                  contentTemplate: 'MyModule/Result',
     *                  contentTemplateOptions: {
     *                      someOption: someValue
     *                  },
     *                  record: new Record({
     *                      rawData: {
     *                          mailText: ''
     *                      }
     *                  }),
     *                  headerContentTemplate: 'MyModule/ResultHeader'
     *              }];
     *              ...
     *     }
     * </pre>
     */
    items?: IWizardItem[];

    /**
     * @name Controls-Wizard/_verticalNew/IWizard#currentStepIndex
     * @cfg {number} Номер текущего шага.
     */
    currentStepIndex?: number;

    /**
     * @name Controls-Wizard/_verticalNew/IWizard#mode
     * @cfg {string} Опция позволят установить режим отображения мастера.
     * @variant edit - режим редактирования.
     * @variant view - режим просмотра.
     * @remark
     * Влияет на:
     * <ul>
     *     <li>Цвет маркера</li>
     * </ul>
     * @default edit
     */
    mode?: string;

    _dataOptionsValue?: AreaSlice;
}

/**
 * Интерфейс для контрола вертикального мастера настройки
 * @interface Controls-Wizard/_verticalNew/IWizard
 * @public
 */
