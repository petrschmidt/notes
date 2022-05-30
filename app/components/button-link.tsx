import React from 'react';
import {
  UnstyledButton,
  UnstyledButtonProps,
  useMantineTheme,
} from '@mantine/core';

export const ButtonLink = (props: UnstyledButtonProps<any>) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      {...props}
      sx={{
        color: theme.colors.blue[5],
        fontSize: 'inherit',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    />
  );
};
