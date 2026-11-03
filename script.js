const repositoryList = document.querySelector("#repository-list");
const repositoryStatus = document.querySelector("#repository-status");

function isRepository(entry) {
  return entry
    && typeof entry.name === "string"
    && typeof entry.url === "string"
    && typeof entry.description === "string"
    && typeof entry.starredAt === "string";
}

function renderRepositories(repositories) {
  if (!Array.isArray(repositories) || !repositories.every(isRepository)) {
    throw new Error("Repository data has an unexpected format.");
  }

  if (repositories.length === 0) {
    repositoryStatus.textContent = "No starred repositories yet.";
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-card";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.name;
    heading.append(link);

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const date = document.createElement("time");
    date.className = "repository-date";
    date.dateTime = repository.starredAt;
    date.textContent = `Starred on ${repository.starredAt}`;

    item.append(heading, description, date);
    fragment.append(item);
  }

  repositoryList.replaceChildren(fragment);
  repositoryStatus.textContent = `${repositories.length} starred ${
    repositories.length === 1 ? "repository" : "repositories"
  }`;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repository data (${response.status}).`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    repositoryStatus.setAttribute("role", "alert");
    repositoryStatus.textContent = error instanceof Error
      ? error.message
      : "Could not load repository data.";
  }
}

loadRepositories();
