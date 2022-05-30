import React, { ReactNode, useEffect, useMemo } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import {
  Box,
  Center,
  LoadingOverlay,
  Overlay,
  Text,
  useMantineTheme,
} from '@mantine/core';

type UseRichTextEditorProps = {
  value?: string;
  loading?: boolean;
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
  loading = false,
  disabled = false,
  disabledPlaceholder,
}: UseRichTextEditorProps): UseRichTextEditorReturn => {
  const theme = useMantineTheme();
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
          '& .ql-toolbar': {
            border: 'none !important',
            borderBottom: `1px solid ${theme.colors.gray[2]} !important`,
          },
        }}
      >
        <LoadingOverlay visible={loading} zIndex={6} transitionDuration={250} />
        {disabled && (
          <Overlay opacity={1} color='white' zIndex={5}>
            <Center sx={{ height: '100%' }}>
              <Text size='lg' color='dimmed'>
                {disabledPlaceholder}
              </Text>
            </Center>
          </Overlay>
        )}
        {/* Height has to be lower than 100% because the editor's toolbar causes vertical overflow */}
        <div ref={quillRef} style={{ border: 'none', height: '94.5%' }} />
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
