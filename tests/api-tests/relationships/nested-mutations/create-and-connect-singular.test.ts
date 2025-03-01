import { text, relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { setupTestRunner } from '@keystone-6/core/testing';
import { apiTestConfig, expectSingleRelationshipError } from '../../utils';

const runner = setupTestRunner({
  config: apiTestConfig({
    models: {
      Group: list({
        fields: {
          name: text(),
        },
      }),
      Event: list({
        fields: {
          title: text(),
          group: relationship({ ref: 'Group' }),
        },
      }),
    },
  }),
});

describe('errors on incomplete data', () => {
  test(
    'when neither id or create data passed',
    runner(async ({ context }) => {
      // Create an item that does the linking
      const { data, errors } = await context.graphql.raw({
        query: `
              mutation {
                createEvent(data: { group: {} }) {
                  id
                }
              }`,
      });

      expect(data).toEqual({ createEvent: null });
      const message =
        'Input error: You must provide "connect" or "create" in to-one relationship inputs for "create" operations.';
      expectSingleRelationshipError(errors, 'createEvent', 'Event.group', message);
    })
  );

  test(
    'when both id and create data passed',
    runner(async ({ context }) => {
      // Create an item that does the linking
      const { data, errors } = await context.graphql.raw({
        query: `
              mutation {
                createEvent(data: { group: {
                  connect: { id: "cabc123"},
                  create: { name: "foo" }
                } }) {
                  id
                }
              }`,
      });

      expect(data).toEqual({ createEvent: null });
      const message =
        'Input error: You must provide "connect" or "create" in to-one relationship inputs for "create" operations.';
      expectSingleRelationshipError(errors, 'createEvent', 'Event.group', message);
    })
  );
});
