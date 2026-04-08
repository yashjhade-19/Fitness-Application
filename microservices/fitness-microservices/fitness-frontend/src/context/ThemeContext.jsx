import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProviderWrapper = ({ children }) => {
    const [mode, setMode] = useState(() => {
        // Check localStorage for saved theme preference
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'dark';
    });

    const toggleTheme = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const theme = createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // Light theme
                    primary: {
                        main: '#FFD700',
                    },
                    secondary: {
                        main: '#FFC107',
                    },
                    background: {
                        default: '#f5f5f5',
                        paper: '#ffffff',
                    },
                    text: {
                        primary: '#1a1a1a',
                        secondary: '#666666',
                    },
                }
                : {
                    // Dark theme - Yellow + Dark Yellow + Black
                    primary: {
                        main: '#FFD700',
                    },
                    secondary: {
                        main: '#FFC107',
                    },
                    background: {
                        default: '#121212',
                        paper: '#1E1E1E',
                    },
                    text: {
                        primary: '#FFFFFF',
                        secondary: '#B0B0B0',
                    },
                }),
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 600,
            },
            h5: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 600,
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: mode === 'light'
                            ? '0 2px 8px rgba(0,0,0,0.1)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};