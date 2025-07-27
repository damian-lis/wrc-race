'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'size-4', // 1rem (default)
  md: 'size-5', // 1.25rem
  lg: 'size-6', // 1.5rem
};

const iconSizeMap = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
};

function Checkbox({ className, size = 'sm', ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        sizeMap[size],
        'peer border-input bg-white text-black data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className={iconSizeMap[size]} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
