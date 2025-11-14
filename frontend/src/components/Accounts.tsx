import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
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
  TextField,
  Chip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';

interface Account {
  id: string;
  name: string;
  email: string;
  company: string;
  isActive: boolean;
  role: string;
  keywords: string[];
}

const Accounts: React.FC = () => {
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

  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    keywords: [],
  });
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
  };

  const handleUpdateAccount = () => {
    if (editingAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id ? editingAccount : acc
      ));
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const handleSetActiveAccount = (accountId: string) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isActive: acc.id === accountId,
    })));
  };

  const handleAddKeyword = (isNewAccount: boolean) => {
    const trimmedKeyword = newKeyword.trim();
    if (!trimmedKeyword) {
      setKeywordError('Anahtar kelime boş olamaz');
      return;
    }

    if (isNewAccount) {
      const keywords = newAccount.keywords || [];
      if (keywords.includes(trimmedKeyword)) {
        setKeywordError('Bu anahtar kelime zaten eklenmiş');
        return;
      }
      setNewAccount(prev => ({
        ...prev,
        keywords: [...keywords, trimmedKeyword],
      }));
    } else if (editingAccount) {
      if (editingAccount.keywords.includes(trimmedKeyword)) {
        setKeywordError('Bu anahtar kelime zaten eklenmiş');
        return;
      }
      setEditingAccount({
        ...editingAccount,
        keywords: [...editingAccount.keywords, trimmedKeyword],
      });
    }

    setNewKeyword('');
    setKeywordError('');
    inputRef.current?.focus();
  };

  const handleRemoveKeyword = (keyword: string, isNewAccount: boolean) => {
    if (isNewAccount) {
      setNewAccount(prev => ({
        ...prev,
        keywords: (prev.keywords || []).filter(k => k !== keyword),
      }));
    } else if (editingAccount) {
      setEditingAccount({
        ...editingAccount,
        keywords: editingAccount.keywords.filter(k => k !== keyword),
      });
    }
  };

  const KeywordSection = ({ 
    keywords = [], 
    isNewAccount = false,
    disabled = false
  }: { 
    keywords: string[], 
    isNewAccount: boolean,
    disabled?: boolean
  }) => {
    const [localKeyword, setLocalKeyword] = useState('');
    const [error, setError] = useState('');

    const handleAddKeyword = () => {
      const trimmedKeyword = localKeyword.trim();
      if (!trimmedKeyword) {
        setError('Anahtar kelime boş olamaz');
        return;
      }

      if (isNewAccount) {
        const currentKeywords = newAccount.keywords || [];
        if (currentKeywords.includes(trimmedKeyword)) {
          setError('Bu anahtar kelime zaten eklenmiş');
          return;
        }
        setNewAccount(prev => ({
          ...prev,
          keywords: [...currentKeywords, trimmedKeyword],
        }));
      } else if (editingAccount) {
        if (editingAccount.keywords.includes(trimmedKeyword)) {
          setError('Bu anahtar kelime zaten eklenmiş');
          return;
        }
        setEditingAccount({
          ...editingAccount,
          keywords: [...editingAccount.keywords, trimmedKeyword],
        });
      }

      setLocalKeyword('');
      setError('');
    };

    return (
      <Box className="space-y-4">
        <Typography variant="subtitle1" className="font-medium">
          Anahtar Kelimeler
        </Typography>
        <Paper 
          variant="outlined" 
          className="p-4"
          sx={{
            backgroundColor: theme => alpha(theme.palette.background.paper, 0.6)
          }}
        >
          <Box className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                onDelete={() => handleRemoveKeyword(keyword, isNewAccount)}
                color="primary"
                variant="outlined"
                disabled={disabled}
              />
            ))}
          </Box>
          {!disabled && (
            <Box className="flex gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="Yeni anahtar kelime ekle"
                value={localKeyword}
                onChange={(e) => {
                  setLocalKeyword(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                error={!!error}
                helperText={error}
              />
              <Button
                variant="contained"
                onClick={handleAddKeyword}
                startIcon={<AddIcon />}
              >
                Ekle
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="primary">
          Hesap Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddAccountDialogOpen(true)}
        >
          Yeni Hesap Ekle
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent>
              <List>
                {accounts.map((account) => (
                  <ListItem
                    key={account.id}
                    className="mb-2 rounded-lg transition-all duration-200"
                    sx={{
                      '&:hover': {
                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>{account.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box className="flex items-center gap-2">
                          {account.name}
                          {account.isActive && (
                            <Chip
                              label="Aktif"
                              size="small"
                              color="primary"
                              icon={<CheckCircleIcon />}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {account.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {account.company} - {account.role}
                          </Typography>
                          <Box className="flex flex-wrap gap-1 mt-2">
                            {account.keywords.map((keyword) => (
                              <Chip
                                key={keyword}
                                label={keyword}
                                size="small"
                                variant="outlined"
                                sx={{ backgroundColor: 'transparent' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box className="flex items-center gap-2">
                        {!account.isActive && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleSetActiveAccount(account.id)}
                          >
                            Aktif Yap
                          </Button>
                        )}
                        <IconButton
                          edge="end"
                          onClick={() => handleEditAccount(account)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Account Dialog */}
      <Dialog
        open={isAddAccountDialogOpen}
        onClose={() => setIsAddAccountDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">Yeni Hesap Ekle</Typography>
            <IconButton onClick={() => setIsAddAccountDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              label="Hesap Adı"
              fullWidth
              value={newAccount.name || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
            />
            <TextField
              label="E-posta"
              fullWidth
              value={newAccount.email || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, email: e.target.value })
              }
            />
            <TextField
              label="Şirket"
              fullWidth
              value={newAccount.company || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, company: e.target.value })
              }
            />
            <TextField
              label="Rol"
              fullWidth
              value={newAccount.role || ''}
              onChange={(e) =>
                setNewAccount({ ...newAccount, role: e.target.value })
              }
            />
            <KeywordSection 
              keywords={newAccount.keywords || []} 
              isNewAccount={true}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddAccountDialogOpen(false)}>İptal</Button>
          <Button onClick={handleAddAccount} variant="contained">
            Ekle
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
            <Typography variant="h6">Hesabı Düzenle</Typography>
            <IconButton onClick={() => setEditingAccount(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingAccount && (
            <Box className="space-y-4 mt-2">
              <TextField
                label="Hesap Adı"
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
                label="E-posta"
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
                label="Şirket"
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
                label="Rol"
                fullWidth
                value={editingAccount.role}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    role: e.target.value,
                  })
                }
              />
              <KeywordSection 
                keywords={editingAccount.keywords} 
                isNewAccount={false}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingAccount(null)}>İptal</Button>
          <Button onClick={handleUpdateAccount} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Accounts; 