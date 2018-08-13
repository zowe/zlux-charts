

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { PipeTransform } from '@angular/core';
import * as zluxBarChart from './bar-chart.interfaces';
export declare class ZluxChartPipe {
    protected mapColumns(value: any, categoryColumnId?: string, valueColumnIds?: Array<string>): any;
    protected mapCatColumn(inputColId: string, columnMetaData: Array<any>): string;
    protected mapValueColumns(inputColIds: Array<string>, columnMetaData: Array<any>, reserved?: string): Array<string>;
}
export declare class ZluxTableDataToChartPipe extends ZluxChartPipe implements PipeTransform {
    transform(value: any, categoryColumnId?: string, valueColumnIds?: Array<string>): Array<zluxBarChart.BarChartRecord>;
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

