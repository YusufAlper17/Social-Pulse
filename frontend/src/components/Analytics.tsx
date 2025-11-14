import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FilterList as FilterListIcon, DateRange as DateRangeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface MediaSource {
  id: string;
  name: string;
  logo: string;
  category: string;
}

interface MediaSources {
  [key: string]: MediaSource[];
}

// Import media sources from Dashboard
const mediaSources: MediaSources = {
  'Haber Siteleri': [
    { id: 'hurriyet', name: 'Hürriyet', logo: '/logos/hurriyet.png', category: 'Haber Siteleri' },
    { id: 'sabah', name: 'Sabah', logo: '/logos/sabah.png', category: 'Haber Siteleri' },
    { id: 'milliyet', name: 'Milliyet', logo: '/logos/milliyet.png', category: 'Haber Siteleri' },
    { id: 'cnnturk', name: 'CNN Türk', logo: '/logos/cnnturk.png', category: 'Haber Siteleri' },
    { id: 'ntv', name: 'NTV', logo: '/logos/ntv.png', category: 'Haber Siteleri' },
    { id: 'trthaber', name: 'TRT Haber', logo: '/logos/trthaber.png', category: 'Haber Siteleri' },
    { id: 'sozcu', name: 'Sözcü', logo: '/logos/sozcu.png', category: 'Haber Siteleri' },
    { id: 't24', name: 'T24', logo: '/logos/t24.png', category: 'Haber Siteleri' },
    { id: 'birgun', name: 'BirGün', logo: '/logos/birgun.png', category: 'Haber Siteleri' },
    { id: 'gazeteduvar', name: 'Gazete Duvar', logo: '/logos/gazeteduvar.png', category: 'Haber Siteleri' },
    { id: 'evrensel', name: 'Evrensel', logo: '/logos/evrensel.png', category: 'Haber Siteleri' },
    { id: 'odatv', name: 'OdaTV', logo: '/logos/odatv.png', category: 'Haber Siteleri' },
    { id: 'bloomberght', name: 'Bloomberg HT', logo: '/logos/bloomberght.png', category: 'Haber Siteleri' },
    { id: 'dunya', name: 'Dünya Gazetesi', logo: '/logos/dunya.png', category: 'Haber Siteleri' },
  ],
  'Blog & İçerik Platformları': [
    { id: 'medium', name: 'Medium', logo: '/logos/medium.png', category: 'Blog & İçerik Platformları' },
    { id: 'wordpress', name: 'Wordpress', logo: '/logos/wordpress.png', category: 'Blog & İçerik Platformları' },
    { id: 'blogger', name: 'Blogger', logo: '/logos/blogger.png', category: 'Blog & İçerik Platformları' },
    { id: 'onedio', name: 'Onedio', logo: '/logos/onedio.png', category: 'Blog & İçerik Platformları' },
    { id: 'webtekno', name: 'Webtekno', logo: '/logos/webtekno.png', category: 'Blog & İçerik Platformları' },
    { id: 'tumblr', name: 'Tumblr', logo: '/logos/tumblr.png', category: 'Blog & İçerik Platformları' },
  ],
  'Sosyal Medya': [
    { id: 'twitter', name: 'Twitter', logo: '/logos/twitter.png', category: 'Sosyal Medya' },
    { id: 'facebook', name: 'Facebook', logo: '/logos/facebook.png', category: 'Sosyal Medya' },
    { id: 'instagram', name: 'Instagram', logo: '/logos/instagram.png', category: 'Sosyal Medya' },
    { id: 'linkedin', name: 'LinkedIn', logo: '/logos/linkedin.png', category: 'Sosyal Medya' },
    { id: 'youtube', name: 'YouTube', logo: '/logos/youtube.png', category: 'Sosyal Medya' },
    { id: 'tiktok', name: 'TikTok', logo: '/logos/tiktok.png', category: 'Sosyal Medya' },
    { id: 'pinterest', name: 'Pinterest', logo: '/logos/pinterest.png', category: 'Sosyal Medya' },
  ],
  'Anlık Haber & İhbar Platformları': [
    { id: 'telegram', name: 'Telegram', logo: '/logos/telegram.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'whatsapp', name: 'WhatsApp', logo: '/logos/whatsapp.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'discord', name: 'Discord', logo: '/logos/discord.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'signal', name: 'Signal', logo: '/logos/signal.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'reddit', name: 'Reddit', logo: '/logos/reddit.png', category: 'Anlık Haber & İhbar Platformları' },
  ],
  'Eğlence & Magazin Siteleri': [
    { id: 'onedio_magazin', name: 'Onedio', logo: '/logos/onedio.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'acunn', name: 'Acunn', logo: '/logos/acunn.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'medyatava', name: 'MedyaTava', logo: '/logos/medyatava.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'raninitv', name: 'RaniniTV', logo: '/logos/raninitv.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'magazinnot', name: 'MagazinNot', logo: '/logos/magazinnot.png', category: 'Eğlence & Magazin Siteleri' },
  ],
};

// Mock data for charts
const sentimentData = [
  { name: 'Pozitif', value: 60, color: '#4CAF50' },
  { name: 'Negatif', value: 25, color: '#f44336' },
  { name: 'Nötr', value: 15, color: '#9e9e9e' },
];

const Analytics: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timelineFilterAnchorEl, setTimelineFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sentimentFilterAnchorEl, setSentimentFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [platformAnalysisFilterAnchorEl, setPlatformAnalysisFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnalysisFilterAnchorEl, setCategoryAnalysisFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [engagementAnalysisFilterAnchorEl, setEngagementAnalysisFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Separate filter states for each chart
  const [timelineSelectedPlatforms, setTimelineSelectedPlatforms] = useState<string[]>([]);
  const [sentimentSelectedPlatforms, setSentimentSelectedPlatforms] = useState<string[]>([]);
  const [platformAnalysisSelectedPlatforms, setPlatformAnalysisSelectedPlatforms] = useState<string[]>([]);
  const [categoryAnalysisSelectedPlatforms, setCategoryAnalysisSelectedPlatforms] = useState<string[]>([]);
  const [engagementAnalysisSelectedPlatforms, setEngagementAnalysisSelectedPlatforms] = useState<string[]>([]);

  // Import media sources from Dashboard
  const allMediaSources = Object.values(mediaSources).flat();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Selected Platforms Display Component
  const SelectedPlatformsDisplay = ({
    selectedPlatforms,
    setSelectedPlatforms,
  }: {
    selectedPlatforms: string[];
    setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  }) => {
    if (selectedPlatforms.length === 0) return null;

    return (
      <Box className="flex flex-wrap gap-1 mt-2">
        {selectedPlatforms.map(platformId => {
          const source = allMediaSources.find(s => s.id === platformId);
          if (!source) return null;
          
          return (
            <Chip
              key={platformId}
              label={source.name}
              size="small"
              onDelete={() => setSelectedPlatforms(prev => prev.filter(id => id !== platformId))}
              sx={{ 
                backgroundColor: 'background.default',
                '& .MuiChip-deleteIcon': {
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                  },
                },
              }}
            />
          );
        })}
        {selectedPlatforms.length > 0 && (
          <Chip
            label="Temizle"
            size="small"
            onClick={() => setSelectedPlatforms([])}
            color="error"
            variant="outlined"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
              },
            }}
          />
        )}
      </Box>
    );
  };

  // Generic filter menu component
  const FilterMenu = ({ 
    anchorEl, 
    onClose, 
    selectedPlatforms, 
    setSelectedPlatforms 
  }: { 
    anchorEl: null | HTMLElement; 
    onClose: () => void;
    selectedPlatforms: string[];
    setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  }) => {
    const handleSelectAll = () => {
      if (selectedPlatforms.length === allMediaSources.length) {
        setSelectedPlatforms([]);
      } else {
        setSelectedPlatforms(allMediaSources.map(source => source.id));
      }
    };

    const handleSelect = (sourceId: string) => {
      setSelectedPlatforms((prev: string[]) => 
        prev.includes(sourceId)
          ? prev.filter((id: string) => id !== sourceId)
          : [...prev, sourceId]
      );
    };

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          style: {
            maxHeight: '400px',
            width: '300px',
          },
        }}
        onClick={(e) => e.stopPropagation()}
        MenuListProps={{
          disablePadding: true,
          onClick: (e) => e.stopPropagation()
        }}
      >
        <MenuItem sx={{ padding: 0 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPlatforms.length === allMediaSources.length}
                indeterminate={selectedPlatforms.length > 0 && selectedPlatforms.length < allMediaSources.length}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
              />
            }
            label="Tümünü Seç"
            sx={{ width: '100%', padding: '8px 16px' }}
          />
        </MenuItem>
        <Divider />
        {Object.entries(mediaSources).map(([category, sources]) => (
          <div key={category}>
            <MenuItem disabled>
              <Typography variant="subtitle2" color="textSecondary">
                {category}
              </Typography>
            </MenuItem>
            {sources.map((source) => (
              <MenuItem 
                key={source.id}
                sx={{ padding: 0 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPlatforms.includes(source.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(source.id);
                      }}
                    />
                  }
                  label={source.name}
                  sx={{ width: '100%', padding: '8px 16px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(source.id);
                  }}
                />
              </MenuItem>
            ))}
            <Divider />
          </div>
        ))}
      </Menu>
    );
  };

  // Filter data functions
  const getFilteredTimelineData = () => 
    timelineSelectedPlatforms.length === 0
      ? timelineData
      : timelineData.map(item => ({
          ...item,
          mentions: Math.floor(item.mentions * (timelineSelectedPlatforms.length / allMediaSources.length))
        }));

  const getFilteredSentimentData = () =>
    sentimentSelectedPlatforms.length === 0 
      ? sentimentData 
      : sentimentData.map(item => ({
          ...item,
          value: item.value * (Math.random() * 0.5 + 0.5)
        }));

  const getFilteredPlatformData = () =>
    platformAnalysisSelectedPlatforms.length === 0
      ? platformData
      : platformData.filter(item => 
          platformAnalysisSelectedPlatforms.some(platformId => 
            allMediaSources.find(source => source.id === platformId)?.name === item.name
          )
        );

  // Mock data for charts
  const platformData = [
    { name: 'Twitter', mentions: 1200 },
    { name: 'Instagram', mentions: 800 },
    { name: 'Facebook', mentions: 600 },
    { name: 'LinkedIn', mentions: 400 },
    { name: 'YouTube', mentions: 300 },
  ];

  const timelineData = [
    { date: '1 Ocak', mentions: 150 },
    { date: '2 Ocak', mentions: 200 },
    { date: '3 Ocak', mentions: 180 },
    { date: '4 Ocak', mentions: 250 },
    { date: '5 Ocak', mentions: 300 },
  ];

  const platformColors = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.secondary.light,
    theme.palette.secondary.main,
  ];

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="primary" className="font-semibold">
          Analiz Paneli
        </Typography>
        <IconButton>
          <DateRangeIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className="mb-4"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Genel Bakış" />
        <Tab label="Platform Analizi" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography variant="h6">
                      Zaman İçinde Bahsedilme
                    </Typography>
                    <SelectedPlatformsDisplay
                      selectedPlatforms={timelineSelectedPlatforms}
                      setSelectedPlatforms={setTimelineSelectedPlatforms}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setTimelineFilterAnchorEl(e.currentTarget)}
                  >
                    Filtrele
                  </Button>
                </Box>
                <Box className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getFilteredTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mentions" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <FilterMenu
              anchorEl={timelineFilterAnchorEl}
              onClose={() => setTimelineFilterAnchorEl(null)}
              selectedPlatforms={timelineSelectedPlatforms}
              setSelectedPlatforms={setTimelineSelectedPlatforms}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Platform Dağılımı
                </Typography>
                <Box className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        dataKey="mentions"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {platformData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={platformColors[index % platformColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography variant="h6">
                      Duygu Analizi
                    </Typography>
                    <SelectedPlatformsDisplay
                      selectedPlatforms={sentimentSelectedPlatforms}
                      setSelectedPlatforms={setSentimentSelectedPlatforms}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setSentimentFilterAnchorEl(e.currentTarget)}
                  >
                    Filtrele
                  </Button>
                </Box>
                <Box className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getFilteredSentimentData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getFilteredSentimentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <FilterMenu
              anchorEl={sentimentFilterAnchorEl}
              onClose={() => setSentimentFilterAnchorEl(null)}
              selectedPlatforms={sentimentSelectedPlatforms}
              setSelectedPlatforms={setSentimentSelectedPlatforms}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography variant="h6">
                      Platform Bazlı Analiz
                    </Typography>
                    <SelectedPlatformsDisplay
                      selectedPlatforms={platformAnalysisSelectedPlatforms}
                      setSelectedPlatforms={setPlatformAnalysisSelectedPlatforms}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setPlatformAnalysisFilterAnchorEl(e.currentTarget)}
                  >
                    Filtrele
                  </Button>
                </Box>
                <Box className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getFilteredPlatformData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mentions" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <FilterMenu
              anchorEl={platformAnalysisFilterAnchorEl}
              onClose={() => setPlatformAnalysisFilterAnchorEl(null)}
              selectedPlatforms={platformAnalysisSelectedPlatforms}
              setSelectedPlatforms={setPlatformAnalysisSelectedPlatforms}
            />
          </Grid>

          {/* Kategori Bazlı Analiz */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography variant="h6">
                      Kategori Bazlı Analiz
                    </Typography>
                    <SelectedPlatformsDisplay
                      selectedPlatforms={categoryAnalysisSelectedPlatforms}
                      setSelectedPlatforms={setCategoryAnalysisSelectedPlatforms}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setCategoryAnalysisFilterAnchorEl(e.currentTarget)}
                  >
                    Filtrele
                  </Button>
                </Box>
                <Box className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(mediaSources).map(([category, sources]) => ({
                          name: category,
                          value: sources.filter(source => 
                            categoryAnalysisSelectedPlatforms.length === 0 || 
                            categoryAnalysisSelectedPlatforms.includes(source.id)
                          ).length
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                      >
                        {Object.keys(mediaSources).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={platformColors[index % platformColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <FilterMenu
              anchorEl={categoryAnalysisFilterAnchorEl}
              onClose={() => setCategoryAnalysisFilterAnchorEl(null)}
              selectedPlatforms={categoryAnalysisSelectedPlatforms}
              setSelectedPlatforms={setCategoryAnalysisSelectedPlatforms}
            />
          </Grid>

          {/* Etkileşim Analizi */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography variant="h6">
                      Platform Etkileşim Analizi
                    </Typography>
                    <SelectedPlatformsDisplay
                      selectedPlatforms={engagementAnalysisSelectedPlatforms}
                      setSelectedPlatforms={setEngagementAnalysisSelectedPlatforms}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setEngagementAnalysisFilterAnchorEl(e.currentTarget)}
                  >
                    Filtrele
                  </Button>
                </Box>
                <Box className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getFilteredPlatformData().map(platform => ({
                      name: platform.name,
                      mentions: platform.mentions,
                      engagement: Math.floor(platform.mentions * (Math.random() * 0.3 + 0.1)),
                      reach: Math.floor(platform.mentions * (Math.random() * 5 + 2)),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mentions" name="Bahsedilme" fill={theme.palette.primary.main} />
                      <Bar dataKey="engagement" name="Etkileşim" fill={theme.palette.secondary.main} />
                      <Bar dataKey="reach" name="Erişim" fill={theme.palette.success.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <FilterMenu
              anchorEl={engagementAnalysisFilterAnchorEl}
              onClose={() => setEngagementAnalysisFilterAnchorEl(null)}
              selectedPlatforms={engagementAnalysisSelectedPlatforms}
              setSelectedPlatforms={setEngagementAnalysisSelectedPlatforms}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
};

export default Analytics; 