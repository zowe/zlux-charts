

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

export interface BarChartRecord {
    name: string;
    displayName?: string;
    values: Array<number>;
}
export interface BarChartOptions {
    rotate?: boolean;
    flipValueAxis?: boolean;
    flipCategoryAxis?: boolean;
}
export interface BarChartDescription {
    categories: Array<CategoryDescription>;
    valueAxisFormatString?: string;
    valueLabelsFormatString?: string;
    valueDomain?: [number, number];
}
export interface CategoryDescription {
    name: string;
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

