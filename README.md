# eq-author-data-export

An utility for exporting Author questionnaires from an environment.

## Prerequisites

 - Install [Node](https://nodejs.org) using `nvm`
 - Install [Yarn](https://yarnpkg.com)
 - Install dependencies with `yarn install`.
 
## Basic Usage
 
 ```bash
 GRAPHQL_API_URL=X \
 AUTH_TOKEN=Y \
 yarn export
```

where:
  - `X` is the URL of the GraphQL API.
  - `Y` is your own authentication token, and

This should export all questionnaires into a timestamped directory.