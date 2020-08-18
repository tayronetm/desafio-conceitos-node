const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs} = request.body;
	const repository = {
			id: uuid(),
			title,
			url,
			techs,
			likes: 0
		}
	repositories.push(repository);
	return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;
	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ msg:'Repository not found' })
	}

	const repositoryUpdate = {
		id,
		title,	
		url,
		techs,
		likes: repositories[repositoryIndex].likes
	}

	repositories[repositoryIndex] = repositoryUpdate;
	response.json(repositoryUpdate);
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ msg: 'Repository not found'})
	}
	repositories.splice(repositoryIndex, 1);
	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ msg: 'Repository not found'})
	}
	repositories[repositoryIndex].likes++;
	return response.json(repositories[repositoryIndex]);
});

module.exports = app;
