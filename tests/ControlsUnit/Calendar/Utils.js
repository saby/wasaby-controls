define('ControlsUnit/Calendar/Utils', [
   'Core/core-clone',
   'Core/core-merge'
], function (coreClone, coreMerge) {
   return {
      createComponent: function (Control, cfg) {
         let mv;
         let Component = Control.default || Control;
         if (Component.getDefaultOptions || Component.defaultProps) {
            // eslint-disable-next-line no-param-reassign
            cfg = this.prepareOptions(Component, cfg);
         }
         mv = new Component(cfg);

         // в afterMount идут дейтсвия с контейнером
         mv._container = mv._container || {};
         mv._children = {
            startValueField: {},
            endValueField: {
               activate: () => {
                  return true;
               }
            }
         };
         mv.saveOptions(cfg);
         mv._beforeMount(cfg);
         return mv;
      },

      createComponentReact: function (Control, cfg) {
         let mv;
         let Component = Control.default || Control;
         if (Component.getDefaultOptions || Component.defaultProps) {
            // eslint-disable-next-line no-param-reassign
            cfg = this.prepareOptions(Component, cfg);
         }
         mv = new Component(cfg);

         return mv;
      },

      prepareOptions: function (Component, cfg) {
         return coreMerge(
            coreClone(cfg || {}),
            Component.defaultProps || Component.getDefaultOptions(),
            { preferSource: true }
         );
      },

      assertMonthView: function (weeks, dayAssertFn) {
         for (let week of weeks) {
            expect(week.length).toEqual(7);
            for (let day of week) {
               if (dayAssertFn) {
                  dayAssertFn(day);
               }
            }
         }
      }
   };
});
