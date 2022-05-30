import React from 'react';
import { UnstyledButton, Text } from '@mantine/core';
import Link from 'next/link';

type NoteListingItem = {
  to: string;
  children: string;
  active?: boolean;
};

export const NoteListingItem: React.FC<NoteListingItem> = ({
  children,
  to,
  active,
}) => (
  <Link href={to} passHref>
    <a style={{ textDecoration: 'none' }}>
      <UnstyledButton
        my='xs'
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.black,
          backgroundColor: active ? theme.colors.gray[0] : '',

          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },
        })}
      >
        {children ? (
          <Text size='sm'>{children}</Text>
        ) : (
          <Text size='sm' color='dimmed'>
            <i>(empty)</i>
          </Text>
        )}
      </UnstyledButton>
    </a>
  </Link>
);
