const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepoId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ error: 'Invalid repository ID.' });

  return next();
}

function verifyIfRepoExists(req, res, next) {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex === -1) return res.status(400).json({ error: 'Repository not found.' });

  return next();
}

const repositories = [];

app.get("/repositories", (req, res) => {
  
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return res.json(repo);
  
});

app.put("/repositories/:id", validateRepoId, verifyIfRepoExists, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const findProject = repositories[repoIndex];

  const repo = {
    id,
    title,
    url,
    techs,
    likes: findProject.likes
  };

  repositories[repoIndex] = repo;

  return res.json(repo);
});

app.delete("/repositories/:id", validateRepoId, verifyIfRepoExists, (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex === -1) return res.status(400).json({ error: 'Project ID not found.' });

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, verifyIfRepoExists, (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex === -1) return res.status(400).json({ error: 'Project ID not found.' });

  repositories[repoIndex].likes += 1;
  
  return res.json({ likes: repositories[repoIndex].likes });
});

module.exports = app;
