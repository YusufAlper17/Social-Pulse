import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import { IconButton, Paper, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface Account {
  id: string;
  name: string;
  email: string;
  company: string;
  isActive: boolean;
  role: string;
  keywords: string[];
}

interface AppContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  activeAccount: Account | null;
  setActiveAccount: (account: Account | null) => void;
  handleLogout: () => void;
}

export const AppContext = createContext<AppContextType>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  language: 'tr',
  setLanguage: () => {},
  accounts: [],
  setAccounts: () => {},
  activeAccount: null,
  setActiveAccount: () => {},
  handleLogout: () => {},
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('tr');
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Ana Hesap',
      email: 'ana@sirket.com',
      company: 'Şirket A.Ş.',
      isActive: true,
      role: 'Admin',
      keywords: ['Şirket', 'Ürün', 'Marka'],
    },
    {
      id: '2',
      name: 'İkinci Hesap',
      email: 'ikinci@sirket.com',
      company: 'Şirket B Ltd.',
      isActive: false,
      role: 'Editor',
      keywords: ['Rakip', 'Sektör'],
    },
  ]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(accounts.find(acc => acc.isActive) || null);

  const handleLogout = () => {
    setActiveAccount(null);
    // Add any additional logout logic here
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2563eb',
        light: '#60a5fa',
        dark: '#1d4ed8'
      },
      secondary: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669'
      },
      background: {
        default: isDarkMode ? '#0f172a' : '#f8fafc',
        paper: isDarkMode ? '#1e293b' : '#ffffff'
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626'
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb'
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669'
      },
      text: {
        primary: isDarkMode ? '#f1f5f9' : '#1e293b',
        secondary: isDarkMode ? '#cbd5e1' : '#64748b'
      },
      divider: isDarkMode ? '#1e293b' : '#f8fafc'
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.015em',
        lineHeight: 1.3
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.015em',
        lineHeight: 1.4
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        letterSpacing: '-0.01em',
        lineHeight: 1.4
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '0.01em',
        lineHeight: 1.5
      },
      body1: {
        fontSize: '0.975rem',
        letterSpacing: '0.01em',
        lineHeight: 1.6
      },
      button: {
        textTransform: 'none',
        fontWeight: 500
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'box-shadow 0.2s ease-in-out'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            '&.MuiChip-filled': {
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)'
            }
          },
          contained: {
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
              },
              '&.Mui-focused': {
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)'
              }
            }
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AppContext.Provider value={{ isDarkMode, setIsDarkMode, language, setLanguage, accounts, setAccounts, activeAccount, setActiveAccount, handleLogout }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="flex h-screen">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Paper 
              component="main" 
              elevation={0}
              className={`flex-grow p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
              sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh'
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <Typography 
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    position: 'relative',
                    paddingBottom: '16px',
                    marginTop: '-8px',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      borderRadius: '1px'
                    }
                  }}
                >
                  {language === 'tr' ? 'Sosyal Medya Takip Sistemi' : 'Social Media Monitoring System'}
                </Typography>
                <IconButton 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  color="inherit"
                  className="rounded-lg hover:bg-opacity-10 hover:bg-primary-500"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Paper>
          </div>
        </Router>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
