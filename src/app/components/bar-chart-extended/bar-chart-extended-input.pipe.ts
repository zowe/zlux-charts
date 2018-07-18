
/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
import { Pipe, PipeTransform } from '@angular/core';

import * as zluxBarChart from './bar-chart-extended.interfaces';

@Pipe({name: 'zluxTableDataToChartExtendedData'})
export class ZluxTableDataToChartExtendedDataPipe implements PipeTransform {
  transform(value: any): zluxBarChart.BarChartData {

    return {};
  }
}

/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
