
/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
import { Pipe, PipeTransform } from '@angular/core';

import * as zluxBarChart from './bar-chart-extended.interfaces';

@Pipe({name: 'zluxTableDataToChartExtendedCategories'})
export class ZluxTableDataToChartExtendedCategoriesPipe implements PipeTransform {
  transform(value: Array<any>, categoryId: string): Array<zluxBarChart.BarChartCategory> {
    return value.map(r => {
      return { field: r[categoryId] };
    });
  }
}

@Pipe({name: 'zluxTableDataToChartExtendedData'})
export class ZluxTableDataToChartExtendedDataPipe implements PipeTransform {
  transform(value: Array<any>, valueId: string, categoryId: string): zluxBarChart.BarChartData {
    let result = {};

    value.forEach(r => {
      const key = r[categoryId];
      result[key] = r[valueId];
    });

    return result;
  }
}

/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
