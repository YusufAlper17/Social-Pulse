import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface KeywordGroup {
  id: string;
  name: string;
  keywords: string[];
}

const ProfileStats = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        width: 'fit-content'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Avatar sx={{ width: 40, height: 40 }} />
        <Typography variant="h6">@TeknoHaber</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        125.000 takipçi
      </Typography>
      <Typography variant="body1" color="text.secondary">
        15.420 gönderi
      </Typography>
    </Box>
  );
};

const Profile: React.FC = () => {
  const [keywordGroups, setKeywordGroups] = useState<KeywordGroup[]>([
    {
      id: '1',
      name: 'Şirket',
      keywords: ['Şirket Adı', 'Marka', 'Ürün'],
    },
    {
      id: '2',
      name: 'Rakipler',
      keywords: ['Rakip1', 'Rakip2', 'Rakip3'],
    },
  ]);

  const [isAddKeywordDialogOpen, setIsAddKeywordDialogOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    position: 'Marketing Manager',
  });

  const handleAddKeyword = () => {
    if (newKeyword && selectedGroup) {
      setKeywordGroups(groups =>
        groups.map(group =>
          group.id === selectedGroup
            ? { ...group, keywords: [...group.keywords, newKeyword] }
            : group
        )
      );
      setNewKeyword('');
      setIsAddKeywordDialogOpen(false);
    }
  };

  const handleDeleteKeyword = (groupId: string, keyword: string) => {
    setKeywordGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? { ...group, keywords: group.keywords.filter(k => k !== keyword) }
          : group
      )
    );
  };

  const handleProfileUpdate = () => {
    // API call to update profile
    setIsEditProfileDialogOpen(false);
  };

  return (
    <div className="p-6">
      <ProfileStats />
      <Typography variant="h4" color="primary" className="mb-6">
        Profil Yönetimi
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent>
              <Box className="flex items-center space-x-4 mb-4">
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src="/path/to/profile-image.jpg"
                />
                <Box>
                  <Typography variant="h6">{profileData.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.company}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditProfileDialogOpen(true)}
                fullWidth
              >
                Profili Düzenle
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">Anahtar Kelime Grupları</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddKeywordDialogOpen(true)}
                >
                  Kelime Ekle
                </Button>
              </Box>
              
              {keywordGroups.map(group => (
                <Box key={group.id} className="mb-4">
                  <Typography variant="subtitle1" className="mb-2">
                    {group.name}
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {group.keywords.map(keyword => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        onDelete={() => handleDeleteKeyword(group.id, keyword)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Divider className="my-4" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Keyword Dialog */}
      <Dialog
        open={isAddKeywordDialogOpen}
        onClose={() => setIsAddKeywordDialogOpen(false)}
      >
        <DialogTitle>Anahtar Kelime Ekle</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              label="Grup"
              select
              fullWidth
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Grup Seçin</option>
              {keywordGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </TextField>
            <TextField
              label="Anahtar Kelime"
              fullWidth
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddKeywordDialogOpen(false)}>İptal</Button>
          <Button onClick={handleAddKeyword} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={isEditProfileDialogOpen}
        onClose={() => setIsEditProfileDialogOpen(false)}
      >
        <DialogTitle>Profili Düzenle</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              label="Ad Soyad"
              fullWidth
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
            <TextField
              label="E-posta"
              fullWidth
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
            />
            <TextField
              label="Şirket"
              fullWidth
              value={profileData.company}
              onChange={(e) =>
                setProfileData({ ...profileData, company: e.target.value })
              }
            />
            <TextField
              label="Pozisyon"
              fullWidth
              value={profileData.position}
              onChange={(e) =>
                setProfileData({ ...profileData, position: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditProfileDialogOpen(false)}>İptal</Button>
          <Button onClick={handleProfileUpdate} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile; 