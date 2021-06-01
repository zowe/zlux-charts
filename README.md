# zLUX charts library
This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.

**NOTE: This repository is archived as it is not currently developed or maintained. If you would like to become a maintainer or use this library, [find the Web UI squad members](https://github.com/zowe/community#communication-channels) to discuss the opportunities.**

Adding the library to your package:
`npm install "./local/path/to/library" --save-dev`

Imports:  
Module: `import { ZluxBarChartModule } from '@zlux/charts'`  
Component: `import { BarChartComponent } from '@zlux/charts'` template: `<zlux-bar-chart>`  
Pipe: pure pipe to transform standard table json data to format accepted by the component: `import { ZluxTableDataToChartPipe } from '@zlux/charts'` template: `zluxTableDataToChart` parameters: `categoryColumnId: string, valueColumnIds: Array<string>`  

This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
