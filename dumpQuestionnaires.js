const { ApolloClient } = require("apollo-client");
const {
  InMemoryCache,
  IntrospectionFragmentMatcher
} = require("apollo-cache-inmemory");
const fetch = require("node-fetch");
const gql = require("graphql-tag");
const { createHttpLink } = require("apollo-link-http");
const chalk = require("chalk");
const dumpQuestionnaireQuery = require("./dumpQuestionnaireQuery");
const stringify = require("json-stable-stringify");

const _fs = require("fs");
const fs = _fs.promises;

const introspectionQueryResultData = require("./fragmentTypes.json");

if (!process.env.AUTH_TOKEN) {
  console.error(chalk.red("AUTH_TOKEN not set"));
  process.exit(1);
}

if (!process.env.GRAPHQL_API_URL) {
  console.error(chalk.red("GRAPHQL_API_URL not set"));
  process.exit(1);
}

const outputDirectory = process.env.OUTPUT_DIR || Date.now().toString();
_fs.mkdirSync(outputDirectory);

const uri = process.env.GRAPHQL_API_URL;
const env = uri.match(/\/\/(\w+)\-/)[1];

const dumpQuestionnaires = async () => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const client = new ApolloClient({
    link: createHttpLink({
      uri,
      headers: {
        authorization: `Bearer ${process.env.AUTH_TOKEN}`
      },
      fetch
    }),
    cache: new InMemoryCache({ fragmentMatcher })
  });

  const result = await client.query({
    query: gql`
      query GetQuestionnaires {
        questionnaires {
          id
        }
      }
    `
  });

  const { questionnaires } = result.data;

  console.log(
    chalk.blue(
      `Exporting ${questionnaires.length} questionnaires from ${env}...`
    )
  );

  questionnaires.forEach(async questionnaire => {
    console.log(chalk.yellow(`Exporting ${questionnaire.id}...`));

    const path = `${outputDirectory}/${questionnaire.id}.json`;

    try {
      let dumpResult = await client.query({
        query: dumpQuestionnaireQuery,
        variables: {
          questionnaireId: questionnaire.id
        }
      });

      if (dumpResult.errors) {
        console.log(
          chalk.red(
            `Error exporting questionnaire with Id ${questionnaire.id}}.`
          )
        );
        console.error(chalk.red(dumpResult.errors));
        await fs.writeFile(path, stringify(dumpResult.errors, { space: 4 }));
        return;
      }

      await fs.writeFile(
        path,
        stringify(dumpResult.data.questionnaire, { space: 4 })
      );

      console.log(
        chalk.green(
          `Successfully exported questionnaire ${
            questionnaire.id
          } to ${path}...`
        )
      );
    } catch (e) {
      console.log(
        chalk.red(`Error exporting questionnaire with Id ${questionnaire.id}}.`)
      );
      console.error(chalk.red(e));
    }
  });
};

dumpQuestionnaires();
