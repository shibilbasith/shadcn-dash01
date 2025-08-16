// "use client"

// import * as React from "react"
// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function ModeToggle() {
//     const { setTheme } = useTheme()

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="icon">
//                     <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//                     <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//                     <span className="sr-only">Toggle theme</span>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => setTheme("light")}>
//                     Light
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("dark")}>
//                     Dark
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("system")}>
//                     System
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// }

'use client';

import { IconBrightness } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();

    const handleThemeToggle = React.useCallback(
        (e?: React.MouseEvent) => {
            const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
            const root = document.documentElement;

            if (!document.startViewTransition) {
                setTheme(newMode);
                return;
            }

            // Set coordinates from the click event
            if (e) {
                root.style.setProperty('--x', `${e.clientX}px`);
                root.style.setProperty('--y', `${e.clientY}px`);
            }

            document.startViewTransition(() => {
                setTheme(newMode);
            });
        },
        [resolvedTheme, setTheme]
    );

    return (
        <Button
            variant='secondary'
            size='icon'
            className='group/toggle size-8'
            onClick={handleThemeToggle}
        >
            <IconBrightness />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    );
}

