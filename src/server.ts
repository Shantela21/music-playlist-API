import { createServer, IncomingMessage, ServerResponse } from 'http';
import { songsRoute } from './routes/songs';

const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    console.log(req.url, 'url');
    if (req.url?.startsWith("/songs")) {
        songsRoute(req, res)
    }else{
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello World!' }));
    }
    // res.writeHead(200, {'content-type': 'application/json'});
    // res.end(JSON.stringify({message: 'Hello, World!'}));
};

const server = createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});