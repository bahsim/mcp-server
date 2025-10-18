import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Create a new MCP server
const server = new McpServer({
  name: 'my-mcp-server',
  version: '1.0.0',
  description: 'My MCP Server',
});

// Register a tool
server.registerTool(
  'my-tool',
  {
    title: 'My Tool',
    description: 'A simple tool that returns a greeting.',
    inputSchema: { name: z.string() },
    outputSchema: { result: z.string() },
  },
  args => {
    return {
      content: [{ type: 'text', text: `Hello, ${args.name}!` }],
      structuredContent: { result: `Hello, ${args.name}!` },
    };
  }
);

// Register a resource
server.registerResource(
  'my-resource',
  'my-resource://info',
  {
    title: 'My Resource Info',
    description: 'A resource that returns server information.',
    mimeType: 'application/json',
  },
  async uri => {
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({
            name: 'My Server',
            version: '1.0.0',
            description: 'A simple server that returns server information.',
          }),
        },
      ],
    };
  }
);

server.registerResource(
  'myResource',
  'myresource://info',
  {
    title: 'My Resource Info',
    description: 'A resource that returns server information.',
    mimeType: 'text/plain',
  },
  async uri => ({
    contents: [
      {
        uri: uri.href,
        text: 'App configuration here',
      },
    ],
  })
);

server.registerResource(
  'config',
  'config://app',
  {
    title: 'Application Config',
    description: 'Application configuration data',
    mimeType: 'text/plain',
  },
  async uri => ({
    contents: [
      {
        uri: uri.href,
        text: 'App configuration here',
      },
    ],
  })
);

server.registerTool(
  'my-prompt',
  {
    title: 'My Prompt',
    description: 'A prompt that returns a greeting.',
    inputSchema: {
      prompt: z.string().describe('The prompt to execute'),
    },
    outputSchema: {
      response: z.string(),
    },
  },
  input => {
    const greetingPrefix = 'Greet in Spanish: ';
    let responseText = `You said: ${input.prompt}`; // Default echo response

    if (input.prompt.startsWith(greetingPrefix)) {
      const name = input.prompt.substring(greetingPrefix.length).trim();
      if (name) {
        responseText = `Hola, ${name}!`;
      } else {
        responseText = 'Hola!';
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
      structuredContent: {
        response: responseText,
      },
    };
  }
);

// Create a transport and start the server
const transport = new StdioServerTransport();
server.connect(transport);

// Log the server status
console.log('Server started');
