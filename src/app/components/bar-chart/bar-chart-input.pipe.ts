

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Pipe, PipeTransform } from '@angular/core';

import * as zluxBarChart from './bar-chart.interfaces';

export class ZluxChartPipe {
  protected mapColumns(value: any, categoryColumnId?: string, valueColumnIds?: Array<string>): any {
    if (value && value.metaData && value.rows) {
      const columnMetaData: Array<any> = value.metaData.columnMetaData ?
                                            value.metaData.columnMetaData : (value.metaData instanceof Array ? value.metaData : null);
      if (columnMetaData && columnMetaData.length > 0) {
        const categoryColumn = this.mapCatColumn(categoryColumnId, columnMetaData);
        const valueColumns = this.mapValueColumns(valueColumnIds, columnMetaData, categoryColumn);
        if (valueColumns == null) {
          // something really bad happened during mapping, and we can't proceed
          return null;
        }
        return { categoryColumn: categoryColumn, valueColumns: valueColumns };
      }
    }
    return null;
  }

  protected mapCatColumn(inputColId: string, columnMetaData: Array<any>): string {
    if (inputColId) {
      if (columnMetaData.some((c: any) => c.columnIdentifier === inputColId)) {
        return inputColId;
      } else {
        console.error(`ZluxChartPipe: category column reference not found: ${inputColId}`);
      }
    }
    // blind & stupid search for any column suitable to be a category, rawDataType === "string" is preferred
    const potentialCats = columnMetaData.filter((c: any) => c.rawDataType && c.rawDataType === 'string');
    if (potentialCats.length > 0) {
      return potentialCats[0].columnIdentifier;
    } else if (columnMetaData.length > 1) {
      return columnMetaData[0].columnIdentifier;
    } else {
      return null;
    }
  }

  protected mapValueColumns(inputColIds: Array<string>, columnMetaData: Array<any>, reserved?: string): Array<string> {
    if (inputColIds instanceof Array && inputColIds.length > 0) {
      const goodRefs: Array<string> = [];
      inputColIds.forEach((colId: string) => {
        const searchResult = columnMetaData.filter((c: any) => c.columnIdentifier === colId);
        if (searchResult.length > 0) {
          goodRefs.push(colId);
        } else {
          console.error(`ZluxChartPipe: value column reference not found: ${colId}`);
        }
      });
      if (goodRefs.length > 0) {
        return goodRefs;
      }
    }
    // blind & stupid search for any numeric column
    const potentialCols = columnMetaData.filter((c: any) => c.rawDataType && c.rawDataType === 'number');
    if (potentialCols.length > 0) {
      return potentialCols[0].columnIdentifier !== reserved ? [potentialCols[0].columnIdentifier] :
              (potentialCols.length > 1 ? [potentialCols[1].columnIdentifier] : null);
    }
    return null;
  }
}

@Pipe({name: 'zluxTableDataToChart'})
export class ZluxTableDataToChartPipe extends ZluxChartPipe implements PipeTransform {
  transform(value: any, categoryColumnId?: string, valueColumnIds?: Array<string>): Array<zluxBarChart.BarChartRecord> {
    const mapping = this.mapColumns(value, categoryColumnId, valueColumnIds);
    if (mapping) {
      const out: Array<zluxBarChart.BarChartRecord> = value.rows.map((row: any, i: number) => ({
        name: mapping.categoryColumn ? row[mapping.categoryColumn] : (i + ''),
        values: mapping.valueColumns.map((vColId: string) => row[vColId])
      }));
      return out;
    }
    console.error(`zluxTableDataToChart: fatal: can't filter input table data.`);
    return [];
  }
}

// @Pipe({name: 'zluxTableDataToDescription'})
// export class ZluxTableDataToChartDescriptionPipe extends ZluxChartPipe implements PipeTransform {
//   transform(value: any, categoryColumnId?: string, valueColumnIds?: Array<string>): zluxBarChart.BarChartDescription {
//     const mapping = this.mapColumns(value, categoryColumnId, valueColumnIds);
//     if (mapping) {

//     }
//     console.error(`zluxTableDataToDescription: fatal: can't filter input table data.`);
//     return null;
//   }
// }


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

