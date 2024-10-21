/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { ISuggest as ISuggestProps } from 'Controls/interface';

/**
 * Интерфейс для Input.Suggest.
 *
 * @interface Controls/_suggest/ISuggest
 * @implements Controls/interface:ISuggest
 * @public
 */

/*
 * Interface for Input.Suggest.
 *
 * @interface Controls/_suggest/ISuggest
 * @public
 * @author Gerasimov A.M.
 */

type ISuggest = ISuggestProps & {
    readonly _options: {
        /**
         * @name Controls/_suggest/ISuggest#displayProperty
         * @cfg {String} Имя свойства элемента, значение которого отобразится в поле ввода поле выбора записи.
         * @demo Controls-demo/Suggest_new/Input/DisplayProperty/DisplayProperty
         * @example
         * myModule.js
         * <pre>
         *    class MyControl extends Control<IControlOptions> {
         *          _template: template,
         *          _suggestValue: null,
         *          _source: null,
         *
         *          _beforeMount: function() {
         *             this._source = new Memory({
         *                rawData: [
         *                   {id: 0, city: 'Yaroslavl'},
         *                   {id: 1, city: 'Moscow'}
         *                ]
         *                keyProperty: 'id'
         *             });
         *          }
         *
         *          _choose: function(event, value) {
         *             this._suggestValue = value;
         *          }
         *    }
         * </pre>
         * myModule.wml
         * <pre>
         *    <div>
         *       <Controls.SuggestInput displayProperty="city" on:choose="_choose()"/>
         *    </div>
         *    ChosenValue: {{_suggestValue || 'Nothing were chosen'}}
         * </pre>
         */

        /*
         * @name Controls/_suggest/ISuggest#displayProperty
         * @cfg {String} Name of the item property which content will be displayed.
         * @remark
         * @demo Controls-demo/Suggest_new/Input/DisplayProperty/DisplayProperty
         * @example
         * myModule.js
         * <pre>
         *    class MyControl extends Control<IControlOptions> {
         *          _template: template,
         *          _suggestValue: null,
         *          _source: null,
         *
         *          _beforeMount: function() {
         *             this._source = new Memory({
         *                rawData: [
         *                   {id: 0, city: 'Yaroslavl'},
         *                   {id: 1, city: 'Moscow'}
         *                ]
         *                keyProperty: 'id'
         *             });
         *          },
         *
         *          _choose: function(event, value) {
         *             this._suggestValue = value;
         *          }
         *       });
         *    }
         * </pre>
         * myModule.wml
         * <pre>
         *    <div>
         *       <Controls.SuggestInput displayProperty="city" on:choose="_choose()"/>
         *    </div>
         *    ChosenValue: {{_suggestValue || 'Nothing were chosen'}}
         * </pre>
         */
        displayProperty: string;
    };
};

/**
 * @event choose Происходит при выборе элемента из автодополнения или окна выбора.
 * @name Controls/_suggest/ISuggest#choose
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Выбранный элемент.
 */

export default ISuggest;
