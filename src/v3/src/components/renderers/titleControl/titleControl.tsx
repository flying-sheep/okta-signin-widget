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

import { CellProps } from '@jsonforms/core';
import { Box, Heading } from '@okta/odyssey-react';
import { FunctionComponent, h } from 'preact';
import { useTranslation } from 'react-i18next';

const TitleControl: FunctionComponent<CellProps> = (
  { uischema: { options } },
) => {
  const { t } = useTranslation();
  const textContent = t(options?.content);

  return (
    // @ts-ignore OKTA-471233
    <Box
      display="flex"
      justifyContent="flex-start"
      marginBottom="s"
    >
      <Heading
        level="2"
        visualLevel="3"
      >
        {textContent}
      </Heading>
    </Box>
  );
};

export default TitleControl;