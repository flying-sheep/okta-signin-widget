/*
 * Copyright (c) 2022-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { Selector } from 'testcafe';

import { checkA11y } from '../util/A11y';

fixture('Login with SMS MFA')
  .page('http://localhost:8080/?siw-use-mocks=true&siw-mock-scenario=auth-with-sms-mfa');

test('User can login using phone SMS MFA', async (t) => {
  const submitButton = Selector('button')
    .withAttribute('data-testid', '#/properties/submit');

  // enter username/pw and submit
  await t
    .typeText("input[id='#/properties/username']", 'testuser@okta.com')
    .typeText("input[id='#/properties/password']", 'password')
    .click(submitButton);

  // ensure we're on the authenticator selection view
  const title = Selector('h2');
  await t
    .expect(title.withExactText("Verify it's you with a security method").exists)
    .ok();

  // click phone authenticator button
  const buttonForPhoneAuth = Selector('div')
    .withAttribute('role', 'button')
    .withText('Okta Phone');
  await t
    .click(buttonForPhoneAuth);

  await t
    .click(Selector('button').withExactText('Receive a code via SMS'));

  // ensure we're on the SMS verification view
  await t
    .expect(title.withExactText('Verify with your phone').exists)
    .ok();

  // enter code
  await t
    .typeText("input[id='#/properties/verificationCode']", '123456');
  // click submit
  // disabled for now since the mock tokens don't match the sessionn
  // and causes an Error, failing the test
  // .click(submitButton);
});

// eslint-disable-next-line
test('Automated accessibility testing', async (t) => {
  await checkA11y(t);
});