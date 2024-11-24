var express = require("express");
const routes = express.Router();
const gitAnalytics = require('../services/gitAnalytics');
const QualityMetricsService = require('../services/qualityMetrics');
const TeamMetricsService = require('../services/teamMetrics');

routes.post('/api/repository/analyze', async (req, res) => {
    try {
      const { repoUrl } = req.body;
      console.log("req body", req.body);
      const analytics = await gitAnalytics.analyzeRepository(repoUrl);
      console.log("response in service----->", analytics);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  routes.get('/api/metrics/quality/:repoId', async (req, res) => {
    try {
      const { repoId } = req.params;
      const metrics = await qualityMetrics.getQualityMetrics(repoId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  routes.get('/api/metrics/team/:repoId', async (req, res) => {
    try {
      const { repoId } = req.params;
      const metrics = await teamMetrics.getTeamMetrics(repoId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = routes;