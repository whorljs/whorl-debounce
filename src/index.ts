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
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
        let func: Function = descriptor.value;
        wait = +wait || 0;
        let timerId: number;

        options = options || {
            immediate: false
        };
        
        interface F { (): any; cancel:Function; flush: Function; pending: Function;}
        let debounced = <F>((...args: any[]): any => {
            let delayed = () => {
                if(!options.immediate) func.apply(target, args);
                timerId = null;
            }

            if(timerId) clearTimeout(timerId);
            else if(options.immediate) {
                func.apply(target, args);
            }
            timerId = setTimeout(delayed, wait);
        });

        descriptor.value = debounced;
    }
}

export { debounce }