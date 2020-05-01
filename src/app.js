const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4"); //ID único Universal

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const searchIndex = repositories.findIndex(repository => repository.id === id);

  if(searchIndex >= 0) {
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[searchIndex].likes
    };

    repositories[searchIndex] = repository;
    return response.json(repository);
  } else {
    return response.status(400).json({ error: 'Repository does not exists.'});
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const searchIndex = repositories.findIndex(repository => repository.id === id);

  if(searchIndex >= 0) {
    repositories.splice(searchIndex, 1);
    return response.status(204).send();
  } else {
    return response.status(400).json({ error: 'Repository does not exists.'});
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const searchIndex = repositories.findIndex(repository => repository.id === id);
  
  if(searchIndex >= 0) {
    repositories[searchIndex].likes += 1;
    return response.json(repositories[searchIndex]);
  } else {
    return response.status(400).json({ error: 'Repository does not exists.'});
  }
});

module.exports = app;