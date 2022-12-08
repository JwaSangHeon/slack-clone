import { useState, useCallback, SetStateAction, Dispatch, ChangeEvent } from 'react';

type ReturnTypes<T> = [T, Dispatch<SetStateAction<T>>, (e: ChangeEvent<HTMLInputElement>) => void];

const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, setValue, handler];
};

export default useInput;
