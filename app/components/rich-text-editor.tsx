import React, { useEffect, useMemo } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

type UseRichTextEditorProps = {
  value?: string;
};

type UseRichTextEditorReturn = {
  editor: JSX.Element;
  getEditorValue: () => string;
  getEditorText: () => string;
};

export const useRichTextEditor = ({
  value,
}: UseRichTextEditorProps): UseRichTextEditorReturn => {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = value ?? '';
      quill.focus();
    }
  }, [quill, value]);

  const editor = useMemo(
    () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
        }}
      >
        <div ref={quillRef} style={{ border: 'none' }} />
      </div>
    ),
    [quillRef],
  );

  const getEditorValue = () => {
    if (quill) {
      return quill.root.innerHTML;
    }

    return '';
  };

  const getEditorText = () => {
    if (quill) {
      console.log(quill.root.innerText);
      return quill.root.innerText;
    }

    return '';
  };

  return {
    editor,
    getEditorValue,
    getEditorText,
  };
};
