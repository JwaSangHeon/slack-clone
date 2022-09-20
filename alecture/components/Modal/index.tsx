import React, { useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stoppropagation();
  }, []);

  if (!show) {
    return null;
  }
};

export default Modal;
