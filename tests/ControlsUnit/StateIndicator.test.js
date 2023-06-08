define(['Controls/progress'], function (progress) {
   describe('Controls.progress:StateIndicator', function () {
      it('calculateColorState 10 sectors, 1 values', function () {
         var psi, data, opts, numSectors, colors;
         psi = new progress.StateIndicator({ scale: 10 });

         opts = { scale: 10, data: [{ value: 0, className: '', title: '' }] };
         numSectors = Math.floor(100 / opts.scale);
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([]).toEqual(data);

         opts = { scale: 10, data: [{ value: 1, className: '', title: '' }] };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1]).toEqual(data);

         opts = { scale: 10, data: [{ value: 19, className: '', title: '' }] };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1]).toEqual(data);

         opts = { scale: 10, data: [{ value: 20, className: '', title: '' }] };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1]).toEqual(data);

         opts = { scale: 10, data: [{ value: 99, className: '', title: '' }] };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 1, 1, 1, 1, 1, 1, 1]).toEqual(data);

         opts = { scale: 10, data: [{ value: 100, className: '', title: '' }] };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]).toEqual(data);
      });

      it('calculateColorState 10 sectors, 2 values', function () {
         var psi, data, opts, numSectors, colors;
         psi = new progress.StateIndicator({ scale: 10 });

         opts = {
            scale: 10,
            data: [
               { value: 0, className: '', title: '' },
               { value: 0, className: '', title: '' }
            ]
         };
         numSectors = Math.floor(100 / opts.scale);
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 1, className: '', title: '' },
               { value: 0, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 1, className: '', title: '' },
               { value: 1, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 2]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 50, className: '', title: '' },
               { value: 50, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 1, 1, 1, 2, 2, 2, 2, 2]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 99, className: '', title: '' },
               { value: 1, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 1, className: '', title: '' },
               { value: 99, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 2, 2, 2, 2, 2, 2, 2, 2, 2]).toEqual(data);

         opts = {
            scale: 10,
            data: [
               { value: 33, className: '', title: '' },
               { value: 33, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 1, 2, 2, 2]).toEqual(data);
      });

      it('calculateColorState 20 sectors, 3 values', function () {
         var psi, data, opts, numSectors, colors;
         psi = new progress.StateIndicator({ scale: 10 });

         opts = {
            scale: 5,
            data: [
               { value: 0, className: '', title: '' },
               { value: 0, className: '', title: '' },
               { value: 0, className: '', title: '' }
            ]
         };
         numSectors = Math.floor(100 / opts.scale);
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([]).toEqual(data);

         opts = {
            scale: 5,
            data: [
               { value: 1, className: '', title: '' },
               { value: 0, className: '', title: '' },
               { value: 1, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 3]).toEqual(data);

         opts = {
            scale: 5,
            data: [
               { value: 1, className: '', title: '' },
               { value: 1, className: '', title: '' },
               { value: 1, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 2, 3]).toEqual(data);

         opts = {
            scale: 5,
            data: [
               { value: 0, className: '', title: '' },
               { value: 0, className: '', title: '' },
               { value: 10, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([3, 3]).toEqual(data);

         opts = {
            scale: 5,
            data: [
               { value: 34, className: '', title: '' },
               { value: 33, className: '', title: '' },
               { value: 33, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([
            1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3
         ]).toEqual(data);

         opts = {
            scale: 5,
            data: [
               { value: 50, className: '', title: '' },
               { value: 25, className: '', title: '' },
               { value: 25, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3
         ]).toEqual(data);
      });
      it('calculateColorState 13 sectors, 4 values', function () {
         var psi, data, opts, numSectors, colors;
         psi = new progress.StateIndicator({ scale: 10 });

         opts = {
            scale: 7.6,
            data: [
               { value: 20, className: '', title: '' },
               { value: 30, className: '', title: '' },
               { value: 3, className: '', title: '' },
               { value: 47, className: '', title: '' }
            ]
         };
         numSectors = Math.floor(100 / opts.scale);
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, numSectors);
         expect([1, 1, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4]).toEqual(data);
      });
      it('simple calculateColorState: 5 sectors with 100%', function () {
         var psi, data, opts, colors;
         psi = new progress.StateIndicator({ scale: 10 });

         opts = {
            scale: 20,
            data: [
               { value: 34, className: '', title: '' },
               { value: 33, className: '', title: '' },
               { value: 33, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, 5);
         expect([1, 1, 2, 2, 3]).toEqual(data);

         opts = {
            scale: 20,
            data: [
               { value: 33, className: '', title: '' },
               { value: 34, className: '', title: '' },
               { value: 33, className: '', title: '' }
            ]
         };
         colors = psi._setColors(opts.data);
         data = psi._calculateColorState(opts, opts.data, colors, 5);
         expect([1, 1, 2, 2, 3]).toEqual(data);
      });
   });
});
