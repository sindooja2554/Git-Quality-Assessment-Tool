// // src/App.jsx
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend
// } from 'recharts';
// const REACT_APP_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
// const REACT_APP_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// const supabase = createClient(
//   REACT_APP_SUPABASE_URL,
//   REACT_APP_SUPABASE_ANON_KEY
// );

// const Dashboard = () => {
//   const [repositoryData, setRepositoryData] = useState(null);
//   const [qualityMetrics, setQualityMetrics] = useState(null);
//   const [teamMetrics, setTeamMetrics] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const analyzeRepository = async (repoUrl) => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:3001/api/repository/analyze', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ repoUrl }),
//       });
//       const data = await response.json();
//       setRepositoryData(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Git Repository Quality Assessment
//           </h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         {/* Repository Input */}
//         <div className="bg-white p-6 rounded-lg shadow mb-6">
//           <input
//             type="text"
//             placeholder="Enter repository URL"
//             className="w-full p-2 border rounded"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 analyzeRepository(e.target.value);
//               }
//             }}
//           />
//         </div>

//         {loading && (
//           <div className="text-center">
//             <p>Analyzing repository...</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 p-4 rounded-lg">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {repositoryData && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Commit Frequency Chart */}
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h2 className="text-xl font-bold mb-4">Commit Frequency</h2>
//               <LineChart width={500} height={300} data={repositoryData.commitFrequency}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="commits" stroke="#8884d8" />
//               </LineChart>
//             </div>

//             {/* Code Quality Metrics */}
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h2 className="text-xl font-bold mb-4">Code Quality</h2>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold">Test Coverage</h3>
//                   <div className="w-full bg-gray-200 rounded">
//                     <div
//                       className="bg-green-500 rounded h-2"
//                       style={{
//                         width: `${qualityMetrics?.testCoverage || 0}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Code Duplication</h3>
//                   <div className="w-full bg-gray-200 rounded">
//                     <div
//                       className="bg-yellow-500 rounded h-2"
//                       style={{
//                         width: `${qualityMetrics?.codeDuplication || 0}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Team Performance */}
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h2 className="text-xl font-bold mb-4">Team Performance</h2>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold">Code Review Efficiency</h3>
//                   <p>{teamMetrics?.codeReviewEfficiency?.averageTime || 'N/A'} hours</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Bug Fix Frequency</h3>
//                   <p>{teamMetrics?.bugFixFrequency?.weekly || 'N/A'} per week</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState, useEffect } from 'react';


function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
      })
    : null;
}

ElevationScroll.propTypes = {
  children: PropTypes.element,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function ElevateAppBar(props) {
  const [repositoryData, setRepositoryData] = useState(null);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [teamMetrics, setTeamMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeRepository = async (repoUrl) => {
    try {
      console.log("in function call");
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/repository/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();
      console.log("data----->", data);
      setRepositoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              Git Repository Quality Assessment
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1,width: '100%', maxWidth: '100%'} }}
          noValidate
          autoComplete="off"
        >
          <TextField fullWidth id="fullWidth" label="Enter repository URL" onKeyDown={(ev) => {
            console.log(`Pressed keyCode ${ev.target}`);
            if (ev.key === 'Enter') {
              analyzeRepository(ev.target.value);
            }
          }} />
        </Box>

        {loading && (
          <div className="text-center">
            <p>Analyzing repository...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {repositoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commit Frequency Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Commit Frequency</h2>
              <LineChart width={500} height={300} data={repositoryData.commitFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commits" stroke="#8884d8" />
              </LineChart>
            </div>

            {/* Code Quality Metrics */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Code Quality</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Test Coverage</h3>
                  <div className="w-full bg-gray-200 rounded">
                    <div
                      className="bg-green-500 rounded h-2"
                      style={{
                        width: `${qualityMetrics?.testCoverage || 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Code Duplication</h3>
                  <div className="w-full bg-gray-200 rounded">
                    <div
                      className="bg-yellow-500 rounded h-2"
                      style={{
                        width: `${qualityMetrics?.codeDuplication || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Team Performance</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Code Review Efficiency</h3>
                  <p>{teamMetrics?.codeReviewEfficiency?.averageTime || 'N/A'} hours</p>
                </div>
                <div>
                  <h3 className="font-semibold">Bug Fix Frequency</h3>
                  <p>{teamMetrics?.bugFixFrequency?.weekly || 'N/A'} per week</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
}