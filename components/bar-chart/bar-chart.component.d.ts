

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { OnChanges, SimpleChanges } from '@angular/core';
import * as zluxBarChart from './bar-chart.interfaces';
export declare class BarChartComponent implements OnChanges {
    private static DEFAULTS;
    data: Array<zluxBarChart.BarChartRecord>;
    chartDescription: zluxBarChart.BarChartDescription;
    chartOptions: zluxBarChart.BarChartOptions;
    container: any;
    chart: any;
    private _dataObj;
    private _options;
    private _chartDescription;
    private options;
    private parentDivHeight;
    private parentDivWidth;
    private width;
    private height;
    private margins;
    private scales;
    private axes;
    private catTicks;
    private tickDivider;
    private valTicks;
    private catDomain;
    private valDomain;
    private catScale;
    private catSide;
    private valScale;
    private valSide;
    private svg;
    private baseG;
    private barGroups;
    private bars;
    constructor();
    ngOnChanges(changes: SimpleChanges): void;
    draw(): void;
    private initSettings(options);
    private initData();
    private initSvg();
    private initAxes();
    private makeAxis(parent, scale, side, axisTickArguments?, axisTickValues?);
    private calculateMargins();
    private getAxisMeasurements(side, axisTickArguments?, axisTickValues?);
    private initChart();
    private drawAxes();
    private drawGridLines();
    private drawBars();
}
export declare class ZluxBarChartModule {
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

