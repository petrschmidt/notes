import React, { ReactNode, useEffect, useMemo } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { Box, Center, Overlay, Text } from '@mantine/core';

type UseRichTextEditorProps = {
  value?: string;
  disabled?: boolean;
  disabledPlaceholder?: ReactNode;
};

type UseRichTextEditorReturn = {
  editor: JSX.Element;
  getEditorValue: () => string;
  getEditorText: () => string;
};

export const useRichTextEditor = ({
  value,
  disabled = false,
  disabledPlaceholder,
}: UseRichTextEditorProps): UseRichTextEditorReturn => {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = value ?? '';
      quill.focus();
    }
  }, [quill, value]);

  useEffect(() => {
    if (quill) {
      quill.enable(!disabled);
    }
  }, [quill, disabled]);

  const editor = useMemo(
    () => (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        {disabled && (
          <Overlay opacity={1} color='white' zIndex={5}>
            <Center sx={{ height: '100%' }}>
              <Text size='lg' color='dimmed'>
                {disabledPlaceholder}
              </Text>
            </Center>
          </Overlay>
        )}
        <div ref={quillRef} style={{ border: 'none' }} />
      </Box>
    ),
    [quillRef, disabled, disabledPlaceholder],
  );

  const getEditorValue = () => {
    if (quill) {
      return quill.root.innerHTML;
    }

    return '';
  };

  const getEditorText = () => {
    if (quill) {
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
