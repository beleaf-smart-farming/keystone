import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';
import { setupTestRunner } from '@keystone-6/core/testing';
import supertest from 'supertest';
import { apiTestConfig } from './utils';

const runner = setupTestRunner({
  config: apiTestConfig({
    models: { User: list({ fields: { name: text() } }) },
    server: {
      extendExpressApp: app => {
        app.get('/magic', (req, res) => {
          res.json({ magic: true });
        });
      },
    },
  }),
});

test(
  'basic extension',
  runner(async ({ app }) => {
    const { text } = await supertest(app)
      .get('/magic')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(JSON.parse(text)).toEqual({
      magic: true,
    });
  })
);
