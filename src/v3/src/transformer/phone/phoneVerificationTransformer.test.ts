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

import { ControlElement } from '@jsonforms/core';
import { getStubTransactionWithNextStep } from 'src/mocks/utils/utils';
import { FormBag } from 'src/types';

import { transformPhoneVerification } from '.';

describe('Phone verification Transformer Tests', () => {
  const transaction = getStubTransactionWithNextStep();
  let formBag: FormBag;
  beforeEach(() => {
    formBag = {
      envelope: {},
      data: {},
      schema: {},
      uischema: {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/methodType',
            options: {
              choices: [{ key: 'sms' }, { key: 'voice' }],
            },
          } as ControlElement,
        ],
      },
    };
  });

  it('should add correct UI elements to schema when multiple methodType choices exists'
    + ' and sms is the first methodType choice', () => {
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(5);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.sms.sendText.withoutPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.sms.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('sms');
    // secondary button
    expect((updatedFormBag.uischema.elements[4] as ControlElement).label)
      .toBe('oie.phone.call.secondaryButton');
    expect(
      (updatedFormBag.uischema.elements[4] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('voice');
  });

  it('should add correct UI elements to schema when multiple methodType choices exists'
    + ' and voice is the first methodType choice', () => {
    formBag.uischema.elements = [{
      type: 'Control',
      scope: '#/properties/methodType',
      options: {
        choices: [{ key: 'voice' }, { key: 'sms' }],
      },
    } as ControlElement];
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(5);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.call.sendText.withoutPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.call.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('voice');
    // secondary button
    expect((updatedFormBag.uischema.elements[4] as ControlElement).label)
      .toBe('oie.phone.sms.secondaryButton');
    expect(
      (updatedFormBag.uischema.elements[4] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('sms');
  });

  it('should add correct UI elements to schema when only voice methodType choice exists', () => {
    formBag.uischema.elements = [{
      type: 'Control',
      scope: '#/properties/methodType',
      options: {
        choices: [{ key: 'voice' }],
      },
    } as ControlElement];
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(4);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.call.sendText.withoutPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.call.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('voice');
  });

  it('should add correct UI elements to schema when only sms methodType choice exists', () => {
    formBag.uischema.elements = [{
      type: 'Control',
      scope: '#/properties/methodType',
      options: {
        choices: [{ key: 'sms' }],
      },
    } as ControlElement];
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(4);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.sms.sendText.withoutPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.sms.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('sms');
  });

  it('should add correct UI elements to schema when only sms methodType choice exists'
    + ' and redacted phoneNumber exists in Idx response ', () => {
    formBag.uischema.elements = [{
      type: 'Control',
      scope: '#/properties/methodType',
      options: {
        choices: [{ key: 'sms' }],
      },
    } as ControlElement];
    transaction.nextStep = {
      name: '',
      canResend: true,
      authenticator: {
        // @ts-ignore OKTA-483184 (profile missing from authenticator interface)
        profile: {
          phoneNumber: '+121xxxxx34',
        },
      },
    };
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(4);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.sms.sendText.withPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.sms.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('sms');
  });

  it('should add correct UI elements to schema when only voice methodType choice exists'
    + ' and redacted phoneNumber exists in Idx response ', () => {
    formBag.uischema.elements = [{
      type: 'Control',
      scope: '#/properties/methodType',
      options: {
        choices: [{ key: 'voice' }],
      },
    } as ControlElement];
    transaction.nextStep = {
      name: '',
      canResend: true,
      authenticator: {
        // @ts-ignore OKTA-483184 (profile missing from authenticator interface)
        profile: {
          phoneNumber: '+121xxxxx34',
        },
      },
    };
    const updatedFormBag = transformPhoneVerification(transaction, formBag);

    expect(updatedFormBag.uischema.elements.length).toBe(4);
    expect(updatedFormBag.uischema.elements[0].options?.content).toBe('oie.phone.verify.title');
    expect(updatedFormBag.uischema.elements[1].options?.content)
      .toBe('next.phone.verify.call.sendText.withPhoneNumber');
    expect(updatedFormBag.uischema.elements[2].options?.content).toBe('oie.phone.carrier.charges');
    // primary button
    expect((updatedFormBag.uischema.elements[3] as ControlElement).label)
      .toBe('oie.phone.call.primaryButton');
    expect(
      (updatedFormBag.uischema.elements[3] as ControlElement)
        .options?.idxMethodParams?.methodType,
    ).toBe('voice');
  });
});