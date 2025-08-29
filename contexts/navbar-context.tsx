"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavbarContextType {
    isCollapsed: boolean
    toggleCollapse: () => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { readonly children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev)
    }, [])

    const value = useMemo(() => ({ isCollapsed, toggleCollapse }), [isCollapsed, toggleCollapse])

    return (
        <NavbarContext.Provider value={value}>
            {children}
        </NavbarContext.Provider>
    )
}

export function useNavbar() {
    const context = useContext(NavbarContext)
    if (context === undefined) {
        throw new Error('useNavbar must be used within a NavbarProvider')
    }
    return context
}

// Remove the custom useCallback implementation below.
// In React, useCallback is imported from 'react' and should not be re-implemented.

