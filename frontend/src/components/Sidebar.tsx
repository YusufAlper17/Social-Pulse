import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IconButton, 
  Tooltip, 
  useTheme, 
  Paper,
  Typography,
  Divider,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { alpha } from '@mui/material/styles';
import { AppContext } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { language, accounts, activeAccount, setActiveAccount, handleLogout } = useContext(AppContext);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const isActiveRoute = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: <DashboardIcon />, label: language === 'tr' ? 'Genel Bakış' : 'Overview' },
    { path: '/analytics', icon: <AnalyticsIcon />, label: language === 'tr' ? 'Analiz' : 'Analytics' },
    { path: '/settings', icon: <SettingsIcon />, label: language === 'tr' ? 'Ayarlar' : 'Settings' },
  ];

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleAccountSwitch = (account: typeof activeAccount) => {
    if (account) {
      setActiveAccount(account);
    }
    handleProfileClose();
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleProfileClose();
    navigate('/');
  };

  const handleAccountManagement = () => {
    handleProfileClose();
    navigate('/settings?tab=accounts');
  };

  return (
    <Paper
      component="aside"
      elevation={1}
      square
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-10
        ${isOpen ? 'w-64' : 'w-20'}`}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.96)
          : theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box className="flex items-center justify-between p-4">
        {isOpen ? (
          <>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.primary.light 
                  : theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: '-0.01em'
              }}
            >
              SocialPulse
            </Typography>
            <IconButton
              onClick={onToggle}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={onToggle}
            size="small"
            className="mx-auto"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.primary.main, 0.08)
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <Box component="nav" className="mt-4 flex-grow">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              {isOpen ? (
                <Link 
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActiveRoute(item.path) 
                      ? `bg-${theme.palette.primary.main}/10 text-primary-600` 
                      : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                  style={{
                    color: isActiveRoute(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: isActiveRoute(item.path)
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    className="ml-3"
                    sx={{
                      fontWeight: isActiveRoute(item.path) ? 500 : 400
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ) : (
                <Tooltip 
                  title={item.label} 
                  placement="right"
                  arrow
                >
                  <Link 
                    to={item.path}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200
                      ${isActiveRoute(item.path)
                        ? `bg-${theme.palette.primary.main}/10`
                        : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                    style={{
                      color: isActiveRoute(item.path)
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary
                    }}
                  >
                    {item.icon}
                  </Link>
                </Tooltip>
              )}
            </li>
          ))}
        </ul>
      </Box>

      <Divider className="mt-auto" />
      
      <Box className="p-4">
        <Box
          onClick={handleProfileClick}
          className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} cursor-pointer p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5`}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            {activeAccount ? activeAccount.name[0] : <AccountCircleIcon />}
          </Avatar>
          {isOpen && (
            <Typography variant="body2" className="font-medium">
              {activeAccount ? activeAccount.name : 'Hesap Seçin'}
            </Typography>
          )}
        </Box>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          {accounts.map((account) => (
            <MenuItem 
              key={account.id}
              onClick={() => handleAccountSwitch(account)}
              selected={activeAccount?.id === account.id}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }}>
                  {account.name[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={account.name}
                secondary={account.company}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: activeAccount?.id === account.id ? 600 : 400
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleAccountManagement}>
            <ListItemIcon>
              <SwitchAccountIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Hesap Yönetimi" />
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default Sidebar; 