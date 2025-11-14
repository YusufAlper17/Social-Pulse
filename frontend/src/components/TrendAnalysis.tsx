import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Chip, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import FilterListIcon from '@mui/icons-material/FilterList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Category {
  id: string;
  label: string;
}

const TrendAnalysis: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('http://localhost:5001/api/trends')
      .then(response => response.json())
      .then(data => setTrends(data));
  }, []);

  const categories: Category[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'tech', label: 'Teknoloji' },
    { id: 'business', label: 'İş Dünyası' },
    { id: 'social', label: 'Sosyal' }
  ];

  const trendChartData = {
    labels: trends?.keywords.map((k: any) => k.name) || [],
    datasets: [{
      label: 'Trend Kelimeler',
      data: trends?.keywords.map((k: any) => k.count) || [],
      backgroundColor: '#2563eb'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Trend Analizi'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="primary">Trend Analizi</Typography>
        <div className="flex items-center space-x-4">
          <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
            <FilterListIcon />
          </IconButton>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? "primary" : "default"}
                variant={selectedCategory === category.id ? "filled" : "outlined"}
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem>
          <TextField
            type="date"
            label="Başlangıç"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </MenuItem>
        <MenuItem>
          <TextField
            type="date"
            label="Bitiş"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </MenuItem>
      </Menu>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div className="h-[400px]">
                {trends && <Bar data={trendChartData} options={chartOptions} />}
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Popüler Etiketler</Typography>
              <div className="flex flex-wrap gap-2">
                {trends?.keywords.map((k: any) => (
                  <Chip 
                    key={k.name} 
                    label={`${k.name} (${k.count})`}
                    color="primary"
                    variant="outlined"
                    className="text-sm"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TrendAnalysis; 