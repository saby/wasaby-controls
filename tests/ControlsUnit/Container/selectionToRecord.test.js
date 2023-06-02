define(['Controls/operations', 'Types/source'], function (
   operations,
   sourceLib
) {
   'use strict';

   describe('Controls.Container.MultiSelector.selectionToRecord', function () {
      it('selectionToRecord', function () {
         var source = new sourceLib.Memory();
         var selectionType;
         var selection;
         var selectionRec;

         selection = {
            selected: ['1', '2'],
            excluded: ['1', '2']
         };
         selectionType = 'leaf';

         selectionRec = operations.selectionToRecord(
            selection,
            source.getAdapter(),
            selectionType
         );
         expect(selectionRec.get('excluded')).toEqual(['1', '2']);
         expect(selectionRec.get('marked')).toEqual(['1', '2']);
         expect(selectionRec.get('type')).toEqual('leaf');
         expect(selectionRec.getFormat().at(0).getKind()).toEqual('string');
         expect(selectionRec.get('recursive')).toBe(true);

         selection = {
            selected: ['2'],
            excluded: ['2']
         };
         selectionType = 'node';

         selectionRec = operations.selectionToRecord(
            selection,
            source.getAdapter(),
            selectionType,
            false
         );
         expect(selectionRec.get('excluded')).toEqual(['2']);
         expect(selectionRec.get('marked')).toEqual(['2']);
         expect(selectionRec.get('type')).toEqual('node');
         expect(selectionRec.get('recursive')).toBe(false);

         selectionType = undefined;
         selectionRec = operations.selectionToRecord(
            selection,
            source.getAdapter(),
            selectionType
         );
         expect(selectionRec.get('type')).toEqual('all');
         expect(selectionRec.get('recursive')).toBe(true);
      });
   });
});
