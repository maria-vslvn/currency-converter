import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { iconButtonTheme as theme } from './IconButton.theme';

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
    icon: ReactNode;
    'aria-label': string;
};

export const IconButton = ({ icon, type = 'button', ...props }: Props) => {
    return (
        <button type={type} className={theme.base} {...props}>
            <span className={theme.icon} aria-hidden="true">
                {icon}
            </span>
        </button>
    );
};
