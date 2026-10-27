import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// Writes only public GitHub metadata. No token or private repository access.
const destination = resolve(process.argv[2] || 'public/data/repos.json');
const repos = [];
for (let page = 1; page <= 20; page++) {
  const response = await fetch(`https://api.github.com/users/WayneZ01/repos?per_page=100&sort=updated&page=${page}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Wayne-Portfolio' },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}; existing data preserved`);
  const batch = await response.json();
  if (!Array.isArray(batch)) throw new Error('Unexpected GitHub response');
  repos.push(...batch.map(({ id, name, description, html_url, homepage, language, stargazers_count, fork, archived }) => ({
    id, name, description, html_url, homepage, language, stargazers_count, fork, archived,
  })));
  if (batch.length < 100) break;
}
if (!repos.length) throw new Error('Empty repository collection; existing data preserved');
await mkdir(dirname(destination), { recursive: true });
const temporary = `${destination}.tmp`;
await writeFile(temporary, JSON.stringify({ updatedAt: new Date().toISOString(), repos }));
await rename(temporary, destination);
console.log(`Updated ${repos.length} public repositories`);
