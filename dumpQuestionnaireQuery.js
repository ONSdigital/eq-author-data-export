const gql = require("graphql-tag");

module.exports = gql`
  fragment answerFragment on Answer {
    id
    type
    label
    description
    guidance
    properties
    qCode
    ... on BasicAnswer {
      ...BasicAnswer
    }
    ... on CompositeAnswer {
      ...CompositeAnswer
    }
  }

  fragment CompositeAnswer on CompositeAnswer {
    validation {
      ... on DateRangeValidation {
        earliestDate {
          ...EarliestDateValidationRule
        }
        latestDate {
          ...LatestDateValidationRule
        }
        minDuration {
          ...MinDurationValidationRule
        }
        maxDuration {
          ...MaxDurationValidationRule
        }
      }
    }
    childAnswers {
      id
      label
    }
  }

  fragment BasicAnswer on BasicAnswer {
    validation {
      ... on NumberValidation {
        minValue {
          ...MinValueValidationRule
        }
        maxValue {
          ...MaxValueValidationRule
        }
      }
      ... on DateValidation {
        earliestDate {
          ...EarliestDateValidationRule
        }
        latestDate {
          ...LatestDateValidationRule
        }
      }
    }
  }

  fragment MinValueValidationRule on MinValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
    previousAnswer {
      id
    }
  }

  fragment MaxValueValidationRule on MaxValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
    previousAnswer {
      id
    }
  }

  fragment EarliestDateValidationRule on EarliestDateValidationRule {
    id
    enabled
    entityType
    custom
    offset {
      value
      unit
    }
    relativePosition
    previousAnswer {
      id
    }
    metadata {
      ...metadataFragment
    }
  }

  fragment LatestDateValidationRule on LatestDateValidationRule {
    id
    enabled
    entityType
    custom
    offset {
      value
      unit
    }
    relativePosition
    previousAnswer {
      id
    }
    metadata {
      ...metadataFragment
    }
  }

  fragment MinDurationValidationRule on MinDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
  }

  fragment MaxDurationValidationRule on MaxDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
  }

  fragment optionFragment on Option {
    id
    label
    description
    value
    qCode
    additionalAnswer {
      ...answerFragment
    }
  }

  fragment destination2Fragment on Destination2 {
    id
    section {
      id
    }
    page {
      id
    }
    logical
  }

  fragment metadataFragment on Metadata {
    id
    key
    alias
    type
    dateValue
    regionValue
    languageValue
    textValue
  }

  query GetQuestionnaire($questionnaireId: ID!) {
    questionnaire(id: $questionnaireId) {
      createdAt
      createdBy {
        id
        name
        email
      }
      id
      title
      description
      theme
      legalBasis
      navigation
      surveyId
      summary
      metadata {
        ...metadataFragment
      }
      sections {
        id
        alias
        title
        introductionTitle
        introductionContent

        pages {
          ... on QuestionPage {
            id
            alias
            title
            description
            guidance
            definitionLabel
            definitionContent
            additionalInfoLabel
            additionalInfoContent
            pageType
            routing {
              id
              rules {
                id
                expressionGroup {
                  id
                  operator
                  expressions {
                    ... on BinaryExpression2 {
                      id
                      left {
                        __typename
                        ... on BasicAnswer {
                          id
                          type
                          label
                        }
                        ... on MultipleChoiceAnswer {
                          id
                          type
                          options {
                            id
                          }
                        }
                      }
                      condition
                      right {
                        __typename
                        ... on CustomValue2 {
                          number
                        }
                        ... on SelectedOptions2 {
                          options {
                            id
                            label
                          }
                        }
                      }
                    }
                  }
                }
                destination {
                  ...destination2Fragment
                }
              }
              else {
                ...destination2Fragment
              }
            }
            confirmation {
              id
              title
              positive {
                label
                description
              }
              negative {
                label
                description
              }
            }
            answers {
              ...answerFragment
              ... on MultipleChoiceAnswer {
                options {
                  ...optionFragment
                }
                mutuallyExclusiveOption {
                  ...optionFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;
