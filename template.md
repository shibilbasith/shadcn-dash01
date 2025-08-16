Shadcn Dashboard prompt

```visual-basic
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

npx shadcn@latest add dashboard-01

npm install next-themes
```

Dark/Light Mode Toggle:

```tsx
//components/theme-provider.tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```tsx
//app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
```

```tsx
//components/ui/mode-toggle.tsx
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- put <modeToggle/> in components/site-header.tsx (replace github Button)

Add Theme Selector:

- [https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/components/theme-selector.tsx](<https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/components/theme-selector.tsx>)

```tsx
/[/components/theme-selector.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/components/theme-selector.tsx)
"use client"

import { useThemeConfig } from "./active-theme"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const DEFAULT_THEMES = [
    {
        name: "Default",
        value: "default",
    },
    {
        name: "Blue",
        value: "blue",
    },
    {
        name: "Green",
        value: "green",
    },
    {
        name: "Amber",
        value: "amber",
    },
]

const SCALED_THEMES = [
    {
        name: "Default",
        value: "default-scaled",
    },
    {
        name: "Blue",
        value: "blue-scaled",
    },
]

const MONO_THEMES = [
    {
        name: "Mono",
        value: "mono-scaled",
    },
]

export function ThemeSelector() {
    const { activeTheme, setActiveTheme } = useThemeConfig()

    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="theme-selector" className="sr-only">
                Theme
            </Label>
            <Select value={activeTheme} onValueChange={setActiveTheme}>
                <SelectTrigger
                    id="theme-selector"
                    size="sm"
                    className="justify-start *:data-[slot=select-value]:w-12"
                >
                    <span className="text-muted-foreground hidden sm:block">
                        Select a theme:
                    </span>
                    <span className="text-muted-foreground block sm:hidden">Theme</span>
                    <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectGroup>
                        <SelectLabel>Default</SelectLabel>
                        {DEFAULT_THEMES.map((theme) => (
                            <SelectItem key={theme.name} value={theme.value}>
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Scaled</SelectLabel>
                        {SCALED_THEMES.map((theme) => (
                            <SelectItem key={theme.name} value={theme.value}>
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Monospaced</SelectLabel>
                        {MONO_THEMES.map((theme) => (
                            <SelectItem key={theme.name} value={theme.value}>
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
```

- https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/active-theme.tsx#L50

```tsx
//components/active-theme.tsx
'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

const DEFAULT_THEME = 'default'

type ThemeContextType = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ActiveThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: string }) {
  const [activeTheme, setActiveTheme] = useState<string>(() => initialTheme || DEFAULT_THEME)

  useEffect(() => {
    Array.from(document.body.classList)
      .filter(className => className.startsWith('theme-'))
      .forEach(className => {
        document.body.classList.remove(className)
      })
    document.body.classList.add(`theme-${activeTheme}`)
    if (activeTheme.endsWith('-scaled')) {
      document.body.classList.add('theme-scaled')
    }
  }, [activeTheme])

  return <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeConfig must be used within an ActiveThemeProvider')
  }
  return context
}
```

- putthe <ThemeSelector /> in components/site-header.tsx (above/below <ModeToggle/>)
- replace the layout

```tsx
//app/layout
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ActiveThemeProvider } from '@/components/active-theme'
import { cn } from '@/lib/utils'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Orcish Dashboard',
  description:
    'A fully responsive analytics dashboard featuring dynamic charts, interactive tables, a collapsible sidebar, and a light/dark mode theme switcher. Built with modern web technologies, it ensures seamless performance across devices, offering an intuitive user interface for data visualization and exploration.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get('active_theme')?.value
  const isScaled = activeThemeValue?.endsWith('-scaled')
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'bg-background overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : ''
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange enableColorScheme>
          <ActiveThemeProvider initialTheme={activeThemeValue}>{children}</ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- add this in globals.css

```tsx

body {
  @apply overscroll-none bg-transparent;
}

:root {
  --font-sans: var(--font-inter);
  --header-height: calc(var(--spacing) * 12 + 1px);
}

.theme-scaled {
  @media (min-width: 1024px) {
    --radius: 0.6rem;
    --text-lg: 1.05rem;
    --text-base: 0.85rem;
    --text-sm: 0.8rem;
    --spacing: 0.222222rem;
  }

  [data-slot="card"] {
    --spacing: 0.16rem;
  }

  [data-slot="select-trigger"],
  [data-slot="toggle-group-item"] {
    --spacing: 0.222222rem;
  }
}

.theme-default,
.theme-default-scaled {
  --primary: var(--color-neutral-600);
  --primary-foreground: var(--color-neutral-50);

  @variant dark {
    --primary: var(--color-neutral-500);
    --primary-foreground: var(--color-neutral-50);
  }
}

.theme-blue,
.theme-blue-scaled {
  --primary: var(--color-blue-600);
  --primary-foreground: var(--color-blue-50);

  @variant dark {
    --primary: var(--color-blue-500);
    --primary-foreground: var(--color-blue-50);
  }
}

.theme-green,
.theme-green-scaled {
  --primary: var(--color-lime-600);
  --primary-foreground: var(--color-lime-50);

  @variant dark {
    --primary: var(--color-lime-600);
    --primary-foreground: var(--color-lime-50);
  }
}

.theme-amber,
.theme-amber-scaled {
  --primary: var(--color-amber-600);
  --primary-foreground: var(--color-amber-50);

  @variant dark {
    --primary: var(--color-amber-500);
    --primary-foreground: var(--color-amber-50);
  }
}

.theme-mono,
.theme-mono-scaled {
  --font-sans: var(--font-mono);
  --primary: var(--color-neutral-600);
  --primary-foreground: var(--color-neutral-50);

  @variant dark {
    --primary: var(--color-neutral-500);
    --primary-foreground: var(--color-neutral-50);
  }

  .rounded-xs,
  .rounded-sm,
  .rounded-md,
  .rounded-lg,
  .rounded-xl {
    @apply !rounded-none;
    border-radius: 0;
  }

  .shadow-xs,
  .shadow-sm,
  .shadow-md,
  .shadow-lg,
  .shadow-xl {
    @apply !shadow-none;
  }

  [data-slot="toggle-group"],
  [data-slot="toggle-group-item"] {
    @apply !rounded-none !shadow-none;
  }
}
```
