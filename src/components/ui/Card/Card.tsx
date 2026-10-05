import type { ComponentPropsWithoutRef } from 'react';

import { cardTheme } from './Card.theme';

type Props = ComponentPropsWithoutRef<'div'>;

export const Card = ({ children, ...props }: Props) => {
    return (
        <div className={cardTheme.base} {...props}>
            {children}
        </div>
    );
};
