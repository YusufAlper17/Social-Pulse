import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Chip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MOCK_COMPETITORS = [
  {
    name: 'Teknoloji Girişimi A',
    logo: 'https://via.placeholder.com/150',
    performance: [45, 60, 55, 70, 65, 75, 80],
    socialMetrics: {
      followers: 15000,
      engagement: '4.5%'
    }
  },
  {
    name: 'Yazılım Çözümleri B',
    logo: 'https://via.placeholder.com/150',
    performance: [50, 55, 60, 65, 70, 75, 80],
    socialMetrics: {
      followers: 12000,
      engagement: '3.8%'
    }
  }
];

const CompetitorAnalysis: React.FC = () => {
  const [competitors] = useState(MOCK_COMPETITORS);

  const performanceChartData = {
    labels: ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4', 'Hafta 5', 'Hafta 6', 'Hafta 7'],
    datasets: competitors.map((comp, index) => ({
      label: comp.name,
      data: comp.performance,
      borderColor: index === 0 ? '#6A5ACD' : '#4CAF50',
      backgroundColor: index === 0 ? 'rgba(106, 90, 205, 0.2)' : 'rgba(76, 175, 80, 0.2)',
    }))
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" className="text-[#6A5ACD] mb-6">Rakip Analizi</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card className="bg-[#1E1E1E] rounded-lg shadow-lg h-full">
            <CardContent>
              <Typography variant="h6" className="mb-4">Performans Karşılaştırması</Typography>
              <Line data={performanceChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="bg-[#1E1E1E] rounded-lg shadow-lg h-full">
            <CardContent>
              <Typography variant="h6" className="mb-4">Rakip Şirketler</Typography>
              {competitors.map((comp) => (
                <div key={comp.name} className="flex items-center mb-4 bg-[#2A2A2A] p-3 rounded-lg">
                  <Avatar src={comp.logo} alt={comp.name} className="mr-4" />
                  <div>
                    <Typography variant="subtitle1">{comp.name}</Typography>
                    <div className="flex space-x-2 mt-2">
                      <Chip 
                        label={`Takipçi: ${comp.socialMetrics.followers}`} 
                        size="small" 
                        className="bg-[#6A5ACD] text-white" 
                      />
                      <Chip 
                        label={`Etkileşim: ${comp.socialMetrics.engagement}`} 
                        size="small" 
                        className="bg-[#4CAF50] text-white" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CompetitorAnalysis; 