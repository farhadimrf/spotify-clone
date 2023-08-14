/**
 * This custom hook provides a debounced value for a given input value.
 * It delays the update of the output value until a specified delay has passed
 * without any further updates to the input value.
 *
 * @param {T} value - The input value to be debounced.
 * @param {number} delay - The delay time (in milliseconds) before updating the debounced value. Default is 500ms.
 * @returns {T} The debounced value that is delayed by the specified delay time.
 */

import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Effect to set up the debounced value and cleanup timer
  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    // Clear the timer when the effect is cleaned up (component unmount or value change)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
