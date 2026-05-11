
// TOOD: possibly setup this in the root directory to pull from both backend and frontend
const server = Bun.serve({
    routes: {},
});

console.log(`Server running at ${server.url}`);
