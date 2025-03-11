import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref,
) {
  const localRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={
        'rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:focus:border-blue-600 dark:focus:ring-blue-600 ' +
        className
      }
      ref={localRef}
    />
  );
});
