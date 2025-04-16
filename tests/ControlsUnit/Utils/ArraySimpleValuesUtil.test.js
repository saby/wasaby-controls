/**
 * Created by kraynovdo on 19.03.2018.
 */
define(['Controls/Utils/ArraySimpleValuesUtil'], function (Util) {
   describe('Controls.Utils.ArraySimpleValuesUtil', function () {
      it('invertTypeIndexOf', function () {
         var arr = [1, 2, 3];
         expect(0).toEqual(Util.invertTypeIndexOf(arr, 1));
         arr = [1, 2, 3];
         expect(0).toEqual(Util.invertTypeIndexOf(arr, '1'));
         arr = ['1', '2', '3'];
         expect(0).toEqual(Util.invertTypeIndexOf(arr, 1));

         var toStringCalled = false;
         var obj = {
            toString: () => {
               toStringCalled = true;
            }
         };
         expect(Util.invertTypeIndexOf(arr, obj)).toEqual(-1);
         expect(toStringCalled).toBe(false);
      });

      it('hasInArray', function () {
         var arr = [1, 2, 3];
         expect(Util.hasInArray(arr, 1)).toBe(true);
         arr = [1, 2, 3];
         expect(Util.hasInArray(arr, '1')).toBe(true);
         arr = ['1', '2', '3'];
         expect(Util.hasInArray(arr, 1)).toBe(true);
      });

      it('addSubArray', function () {
         var arr1, arr2;

         arr1 = [];
         arr2 = [1, 2];
         Util.addSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2]);

         arr1 = [1, 2];
         arr2 = [];
         Util.addSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2]);

         arr1 = [1, 2];
         arr2 = [3, 4];
         Util.addSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2, 3, 4]);

         arr1 = [1, 2];
         arr2 = [2, 3];
         Util.addSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2, 3]);
      });

      it('removeSubArray', function () {
         var arr1, arr2;

         arr1 = [];
         arr2 = [1, 2];
         Util.removeSubArray(arr1, arr2);
         expect(arr1).toEqual([]);

         arr1 = [1, 2];
         arr2 = [];
         Util.removeSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2]);

         arr1 = [1, 2];
         arr2 = [3, 4];
         Util.removeSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2]);

         arr1 = [1, 2];
         arr2 = [2, 3];
         Util.removeSubArray(arr1, arr2);
         expect(arr1).toEqual([1]);

         arr1 = [1, 2, 3, 4];
         arr2 = [4, 3];
         Util.removeSubArray(arr1, arr2);
         expect(arr1).toEqual([1, 2]);
      });

      it('getArrayDifference', function () {
         var arr1, arr2, diff;

         arr1 = [];
         arr2 = [1, 2];
         diff = Util.getArrayDifference(arr1, arr2);
         expect({ removed: [], added: [1, 2] }).toEqual(diff);

         arr1 = [1, 2];
         arr2 = [];
         diff = Util.getArrayDifference(arr1, arr2);
         expect({ removed: [1, 2], added: [] }).toEqual(diff);

         arr1 = [1, 2];
         arr2 = [3, 4];
         diff = Util.getArrayDifference(arr1, arr2);
         expect({ removed: [1, 2], added: [3, 4] }).toEqual(diff);

         arr1 = [1, 2];
         arr2 = [2, 3];
         diff = Util.getArrayDifference(arr1, arr2);
         expect({ removed: [1], added: [3] }).toEqual(diff);

         arr1 = [1, 2];
         arr2 = [1, 2];
         diff = Util.getArrayDifference(arr1, arr2);
         expect({ removed: [], added: [] }).toEqual(diff);
      });
   });
});
