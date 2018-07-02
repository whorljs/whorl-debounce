/******************************************************************************
 * Debounce
 * delays execution of a frequently called method
 * since methods are run asyncronously, they cannot directly return a result.
 * 
 * wait: milliseconds to delay until the method can be invoked
 * options: 
 * * immediate: fire on first call as well as the last
 *****************************************************************************/

import { DebounceOptions } from './options';

function debounce(wait: number, options?: DebounceOptions) {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>):any {
        let func: Function = descriptor.value;
        wait = +wait || 0;
        let timerId: number;

        options = options || {
            immediate: false
        };
        
        function debounced(...args: any[]): any {
            let delayed = () => {
                if(!options.immediate) func.apply(this || target, args);
                timerId = null;
            }

            if(timerId) clearTimeout(timerId);
            else if(options.immediate) {
                func.apply(this || target, args);
            }
            timerId = setTimeout(delayed, wait);
        };

        descriptor.value = debounced;

        return descriptor;
    }
}

export { debounce }