import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { AppContext } from '../App';
import {
  clearNewsApiKey,
  getNewsApiKey,
  hasNewsApiKey,
  setNewsApiKey,
} from '../utils/newsApiKey';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Account {
  id: string;
  name: string;
  email: string;
  company: string;
  isActive: boolean;
  role: string;
  keywords: string[];
}

const Settings: React.FC = () => {
  const { isDarkMode, setIsDarkMode, language, setLanguage, accounts, setAccounts, activeAccount, setActiveAccount } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    keywords: [],
  });
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const [newsApiKey, setNewsApiKeyInput] = useState('');
  const [newsApiKeySaved, setNewsApiKeySaved] = useState(false);
  const [newsApiKeyError, setNewsApiKeyError] = useState('');

  useEffect(() => {
    setNewsApiKeyInput(getNewsApiKey());
    setNewsApiKeySaved(hasNewsApiKey());
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'accounts') {
      setTabValue(1);
    }
  }, [searchParams]);

  const handleSaveNewsApiKey = () => {
    const trimmedKey = newsApiKey.trim();

    if (!trimmedKey) {
      setNewsApiKeyError(
        language === 'tr'
          ? 'Lütfen News API anahtarınızı girin.'
          : 'Please enter your News API key.'
      );
      return;
    }

    setNewsApiKey(trimmedKey);
    setNewsApiKeySaved(true);
    setNewsApiKeyError('');
  };

  const handleClearNewsApiKey = () => {
    clearNewsApiKey();
    setNewsApiKeyInput('');
    setNewsApiKeySaved(false);
    setNewsApiKeyError('');
  };

  const handleAddKeywordToNewAccount = () => {
    const trimmedKeyword = newKeyword.trim();
    if (!trimmedKeyword) {
      setKeywordError('Anahtar kelime boş olamaz');
      return;
    }

    if (newAccount.keywords?.includes(trimmedKeyword)) {
      setKeywordError('Bu anahtar kelime zaten eklenmiş');
      return;
    }

    setNewAccount(prev => ({
      ...prev,
      keywords: [...(prev.keywords ?? []), trimmedKeyword],
    }));
    setNewKeyword('');
    setKeywordError('');
  };

  const handleRemoveKeywordFromNewAccount = (keyword: string) => {
    setNewAccount(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(k => k !== keyword) ?? [],
    }));
  };

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.email) {
      const account: Account = {
        id: Date.now().toString(),
        name: newAccount.name,
        email: newAccount.email,
        company: newAccount.company || '',
        isActive: false,
        role: newAccount.role || 'Editor',
        keywords: newAccount.keywords || [],
      };
      setAccounts([...accounts, account]);
      setNewAccount({ keywords: [] });
      setIsAddAccountDialogOpen(false);
    }
  };

  const handleAddKeywordToEditingAccount = () => {
    if (newKeyword.trim() === '') {
      setKeywordError('Lütfen bir anahtar kelime girin');
      return;
    }

    if (editingAccount) {
      setEditingAccount({
        ...editingAccount,
        keywords: [...editingAccount.keywords, newKeyword],
      });
    }
    setNewKeyword('');
    setKeywordError('');
  };

  const handleRemoveKeywordFromEditingAccount = (keyword: string) => {
    if (editingAccount) {
      const updatedKeywords = editingAccount.keywords.filter((k) => k !== keyword);
      setEditingAccount({ ...editingAccount, keywords: updatedKeywords });
    }
  };

  const handleUpdateAccount = () => {
    if (editingAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id ? editingAccount : acc
      ));
      if (activeAccount?.id === editingAccount.id) {
        setActiveAccount(editingAccount);
      }
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    if (activeAccount?.id === accountId) {
      setActiveAccount(null);
    }
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const handleSetActiveAccount = (accountId: string) => {
    const newActiveAccount = accounts.find(acc => acc.id === accountId) || null;
    setActiveAccount(newActiveAccount);
    setAccounts(accounts.map(acc => ({
      ...acc,
      isActive: acc.id === accountId,
    })));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="primary" className="mb-6">
        {language === 'tr' ? 'Ayarlar' : 'Settings'}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className="mb-4"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label={language === 'tr' ? 'Genel' : 'General'} />
        <Tab label={language === 'tr' ? 'Hesap Yönetimi' : 'Account Management'} />
        <Tab label={language === 'tr' ? 'Bildirimler' : 'Notifications'} />
        <Tab label={language === 'tr' ? 'Güvenlik' : 'Security'} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  {language === 'tr' ? 'Görünüm Ayarları' : 'Theme Settings'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                      icon={<LightModeIcon />}
                      checkedIcon={<DarkModeIcon />}
                    />
                  }
                  label={isDarkMode ? (language === 'tr' ? "Koyu Tema" : "Dark Theme") : (language === 'tr' ? "Açık Tema" : "Light Theme")}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  {language === 'tr' ? 'Dil Ayarları' : 'Language Settings'}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>{language === 'tr' ? 'Dil' : 'Language'}</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label={language === 'tr' ? 'Dil' : 'Language'}
                  >
                    <MenuItem value="tr">Türkçe</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6">
                    {language === 'tr' ? 'News API Anahtarı' : 'News API Key'}
                  </Typography>
                  <Chip
                    icon={<KeyIcon />}
                    label={
                      newsApiKeySaved
                        ? (language === 'tr' ? 'Kayıtlı' : 'Saved')
                        : (language === 'tr' ? 'Eksik' : 'Missing')
                    }
                    color={newsApiKeySaved ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" className="mb-4">
                  {language === 'tr'
                    ? 'Haber verilerini çekmek için NewsAPI.org anahtarınızı buraya girin. Anahtar tarayıcınızda saklanır ve API isteklerinde kullanılır.'
                    : 'Enter your NewsAPI.org key here to fetch news data. The key is stored in your browser and sent with API requests.'}
                </Typography>
                <TextField
                  label={language === 'tr' ? 'News API Anahtarı' : 'News API Key'}
                  type="password"
                  fullWidth
                  value={newsApiKey}
                  onChange={(e) => {
                    setNewsApiKeyInput(e.target.value);
                    setNewsApiKeyError('');
                  }}
                  error={Boolean(newsApiKeyError)}
                  helperText={
                    newsApiKeyError ||
                    (language === 'tr'
                      ? 'Ücretsiz anahtar almak için newsapi.org adresini ziyaret edin.'
                      : 'Visit newsapi.org to get a free API key.')
                  }
                  className="mb-4"
                />
                <Box className="flex flex-wrap gap-2">
                  <Button variant="contained" onClick={handleSaveNewsApiKey}>
                    {language === 'tr' ? 'Kaydet' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearNewsApiKey}
                    disabled={!newsApiKeySaved && !newsApiKey}
                  >
                    {language === 'tr' ? 'Anahtarı Sil' : 'Remove Key'}
                  </Button>
                  <Button
                    component="a"
                    href="https://newsapi.org/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                  >
                    {language === 'tr' ? 'Anahtar Al' : 'Get API Key'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">
                    {language === 'tr' ? 'Hesap Yönetimi' : 'Account Management'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddAccountDialogOpen(true)}
                  >
                    {language === 'tr' ? 'Yeni Hesap Ekle' : 'Add New Account'}
                  </Button>
                </Box>
                <List>
                  {accounts.map((account) => (
                    <ListItem
                      key={account.id}
                      className="mb-2 rounded-lg hover:bg-black/5"
                    >
                      <ListItemAvatar>
                        <Avatar>{account.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box className="flex items-center">
                            {account.name}
                            <Chip
                              size="small"
                              label={account.isActive ? "Aktif" : "Pasif"}
                              color={account.isActive ? "success" : "default"}
                              className="ml-2"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {account.email} • {account.company}
                            </Typography>
                            <Box className="mt-1">
                              {account.keywords.map((keyword) => (
                                <Chip
                                  key={keyword}
                                  label={keyword}
                                  size="small"
                                  className="mr-1 mt-1"
                                />
                              ))}
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditAccount(account)}
                          className="mr-1"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  {language === 'tr' ? 'Bildirim Ayarları' : 'Notification Settings'}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={language === 'tr' ? "E-posta Bildirimleri" : "Email Notifications"}
                      secondary={language === 'tr' ? "Önemli güncellemeler ve raporlar için e-posta bildirimleri" : "Important updates and reports via email"}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={language === 'tr' ? "Push Bildirimleri" : "Push Notifications"}
                      secondary={language === 'tr' ? "Anlık bildirimler ve uyarılar" : "Instant notifications and alerts"}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  {language === 'tr' ? 'Güvenlik Ayarları' : 'Security Settings'}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <SecurityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={language === 'tr' ? "İki Faktörlü Doğrulama" : "Two-Factor Authentication"}
                      secondary={language === 'tr' ? "Hesabınızı daha güvenli hale getirin" : "Make your account more secure"}
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" color="primary">
                        {language === 'tr' ? "Aktifleştir" : "Activate"}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <SecurityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={language === 'tr' ? "Şifre Değiştir" : "Change Password"}
                      secondary={language === 'tr' ? "Hesap güvenliğinizi güncelleyin" : "Update your account security"}
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" color="primary">
                        {language === 'tr' ? "Değiştir" : "Change"}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add Account Dialog */}
      <Dialog
        open={isAddAccountDialogOpen}
        onClose={() => setIsAddAccountDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              {language === 'tr' ? 'Yeni Hesap Ekle' : 'Add New Account'}
            </Typography>
            <IconButton onClick={() => setIsAddAccountDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              label={language === 'tr' ? "Hesap Adı" : "Account Name"}
              fullWidth
              value={newAccount.name || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
            />
            <TextField
              label={language === 'tr' ? "E-posta" : "Email"}
              fullWidth
              value={newAccount.email || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, email: e.target.value })
              }
            />
            <TextField
              label={language === 'tr' ? "Şirket" : "Company"}
              fullWidth
              value={newAccount.company || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, company: e.target.value })
              }
            />
            <TextField
              label={language === 'tr' ? "Rol" : "Role"}
              fullWidth
              value={newAccount.role || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, role: e.target.value })
              }
            />
            <Box>
              <Typography variant="subtitle2" className="mb-2">
                {language === 'tr' ? 'Anahtar Kelimeler' : 'Keywords'}
              </Typography>
              <Box className="flex gap-2 mb-2">
                <TextField
                  label={language === 'tr' ? "Yeni Anahtar Kelime" : "New Keyword"}
                  size="small"
                  value={newKeyword}
                  onChange={(e) => {
                    setNewKeyword(e.target.value);
                    setKeywordError('');
                  }}
                  error={Boolean(keywordError)}
                  helperText={keywordError}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeywordToNewAccount();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddKeywordToNewAccount}
                  className="whitespace-nowrap"
                >
                  {language === 'tr' ? 'Ekle' : 'Add'}
                </Button>
              </Box>
              <Box className="flex flex-wrap gap-1">
                {newAccount.keywords?.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => handleRemoveKeywordFromNewAccount(keyword)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddAccountDialogOpen(false)}>
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </Button>
          <Button onClick={handleAddAccount} variant="contained">
            {language === 'tr' ? 'Ekle' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog
        open={Boolean(editingAccount)}
        onClose={() => setEditingAccount(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              {language === 'tr' ? 'Hesabı Düzenle' : 'Edit Account'}
            </Typography>
            <IconButton onClick={() => setEditingAccount(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingAccount && (
            <Box className="space-y-4 mt-2">
              <TextField
                label={language === 'tr' ? "Hesap Adı" : "Account Name"}
                fullWidth
                value={editingAccount.name}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    name: e.target.value,
                  })
                }
              />
              <TextField
                label={language === 'tr' ? "E-posta" : "Email"}
                fullWidth
                value={editingAccount.email}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label={language === 'tr' ? "Şirket" : "Company"}
                fullWidth
                value={editingAccount.company}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    company: e.target.value,
                  })
                }
              />
              <TextField
                label={language === 'tr' ? "Rol" : "Role"}
                fullWidth
                value={editingAccount.role}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    role: e.target.value,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingAccount.isActive}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label={language === 'tr' ? "Hesap Aktif" : "Account Active"}
              />
              <Box>
                <Typography variant="subtitle2" className="mb-2">
                  {language === 'tr' ? 'Anahtar Kelimeler' : 'Keywords'}
                </Typography>
                <Box className="flex gap-2 mb-2">
                  <TextField
                    label={language === 'tr' ? "Yeni Anahtar Kelime" : "New Keyword"}
                    size="small"
                    value={newKeyword}
                    onChange={(e) => {
                      setNewKeyword(e.target.value);
                      setKeywordError('');
                    }}
                    error={Boolean(keywordError)}
                    helperText={keywordError}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeywordToEditingAccount();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddKeywordToEditingAccount}
                    className="whitespace-nowrap"
                  >
                    {language === 'tr' ? 'Ekle' : 'Add'}
                  </Button>
                </Box>
                <Box className="flex flex-wrap gap-1">
                  {editingAccount.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      onDelete={() => handleRemoveKeywordFromEditingAccount(keyword)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingAccount(null)}>
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </Button>
          <Button onClick={handleUpdateAccount} variant="contained">
            {language === 'tr' ? 'Kaydet' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;
 