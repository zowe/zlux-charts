

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { NgModule, Component, Input, ViewChild,
         OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

import * as zluxBarChart from './bar-chart.interfaces';
import { ZluxTableDataToChartPipe } from './bar-chart-input.pipe';

@Component({
  selector: 'zlux-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  private static DEFAULTS = {
    CSS: {
      XAXIS: 'x-axis',
      YAXIS: 'y-axis',
      CATAXIS: 'category-axis',
      VALAXIS: 'value-axis',
      BAR: 'bar',
      CATEGORY: 'category'
    },

    BAR_INNER_PADDING: 0.2,
    BAR_OUTER_PADDING: 0.2,

    // around the entire chart, px
    MIN_PADDING: 3,
    // minimal acceptable tick spacing is determined via f(x) = a * x + b
    // where "x" is max size (W or H) of all the ticks,  "a" is a fraction of ticks' relevant size (W or H),
    // and "b" is a pixel constant
    MIN_TICKS_SPACING_V: (x => 0.4 * x + 3 ),
    MIN_TICKS_SPACING_H: (x => 0.2 * x + 3 ),
    // hard limits for for value axis only
    MIN_TICKS: 2,
    MAX_TICKS: 20,
    // How much ticks we consider to be a "nice" base value.
    // This is merely a starting point for calculations, not a final amount of ticks.
    HINT_TICKS: 10
  };

  @Input() get data(): Array<zluxBarChart.BarChartRecord> {
    return this._dataObj ? this._dataObj.data : null;
  }
  set data(newData: Array<zluxBarChart.BarChartRecord>) {
    if (!this._dataObj || this._dataObj.data !== newData) {
      this._dataObj = new BarChartData(newData);
    }
  }
  @Input() get chartDescription(): zluxBarChart.BarChartDescription {
    return this._chartDescription ? this._chartDescription.data : null;
  }
  set chartDescription(newChartDescription: zluxBarChart.BarChartDescription) {
    if (!this._chartDescription || this._chartDescription.data !== newChartDescription) {
      this._chartDescription = new BarChartDescription(newChartDescription);
    }
  }
  @Input() get chartOptions(): zluxBarChart.BarChartOptions {
    return this._options;
  }
  set chartOptions(newOptions: zluxBarChart.BarChartOptions) {
    if (this._options !== newOptions) {
      this._options = newOptions;
      this.options = this.initSettings(newOptions);
    }
  }

  @ViewChild('container') container: any;
  @ViewChild('chart') chart: any;

  private _dataObj: BarChartData;
  private _options: zluxBarChart.BarChartOptions;
  private _chartDescription: BarChartDescription = new BarChartDescription(null);

  // private, freely mutable copy of _options
  private options: zluxBarChart.BarChartOptions;
  // px, base w/h for the chart
  private parentDivHeight: number;
  private parentDivWidth: number;
  // px, space for the chart itself, sans margins and axis
  private width: number;
  private height: number;
  // top/left/bottom/right px values, based primarily on labels sizes (we'd want to make enough space to place labels)
  private margins: Record<Side, number>;
  // 2 of these will inevitably stay null
  private scales: Record<Side, any>;
  private axes: Record<Side, any>;

  private catTicks: number;
  private tickDivider: number; // used to hide overlapping ticks for category axis
  private valTicks: number;

  private catDomain: any;
  private valDomain: any;
  private catScale: any;
  private catSide: Side;
  private valScale: any;
  private valSide: Side;
  // d3 selections holding interesting things
  private svg: any;
  private baseG: any;
  private barGroups: any;
  private bars: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartOptions || changes.data || changes.chartDescription) {
      this.draw();
    }
  }

  public draw(): void {
    if (this._dataObj.data.length > 0) {
      this.initData();
      this.initSvg();
      this.calculateMargins(); // temporarily draws both axes to calculate label sizes & additional space needed
      this.initChart();
      this.drawAxes();
      this.drawBars();
    }
  }

  /*
    Nice and easy way to fill in defaults
  */
  private initSettings(options: zluxBarChart.BarChartOptions): zluxBarChart.BarChartOptions {
    const out = { ...options };
    out.flipValueAxis = out.flipValueAxis || false;
    out.flipCategoryAxis = out.flipCategoryAxis || false;
    out.rotate = out.rotate || false;
    return out;
  }

  private initData(): void {
    this.margins = { [Side.TOP]: 0, [Side.BOTTOM]: 0, [Side.LEFT]: 0, [Side.RIGHT]: 0 };
    this.scales = { [Side.TOP]: null, [Side.BOTTOM]: null, [Side.LEFT]: null, [Side.RIGHT]: null };
    this.axes = { [Side.TOP]: null, [Side.BOTTOM]: null, [Side.LEFT]: null, [Side.RIGHT]: null };
    this.catDomain = this._dataObj.data.map(
      (d: zluxBarChart.BarChartRecord) => BarChartData.getDatumLabel(d)
    );
    this.valDomain = [0, d3.max(this._dataObj.data.map(
      (d: zluxBarChart.BarChartRecord) => d.values.reduce((
        (a: number, v: number) => a + v
      ), 0)
    ))];
    if (this._chartDescription.getValueDomain()) {
      const descDomain = this._chartDescription.getValueDomain();
      if (descDomain[0] < this.valDomain[0]) {
        this.valDomain[0] = descDomain[0];
      }
      if (descDomain[1] > this.valDomain[1]) {
        this.valDomain[1] = descDomain[1];
      }
    }
  }

  private initSvg(): void {
    this.svg = d3.select(this.chart.nativeElement);
    this.svg.selectAll('*').remove();
    this.svg
      .attr('width', 0)
      .attr('height', 0);
    this.parentDivHeight = Math.floor(this.container.nativeElement.getBoundingClientRect().height);
    this.parentDivWidth = Math.floor(this.container.nativeElement.getBoundingClientRect().width);
    // console.log(`Svg: taking ${this.parentDivWidth} x ${this.parentDivHeight}`);
    this.svg
      .attr('width', this.parentDivWidth)
      .attr('height', this.parentDivHeight);
    this.baseG = this.svg.append('g');
    // these are not final here
    this.width = this.parentDivWidth;
    this.height = this.parentDivHeight;
  }

  private initAxes(): void {
    const catValueRange: [number, number] = this.options.rotate ? [0, this.height] : [0, this.width];
    this.catScale = d3.scaleBand().range(catValueRange)
                      .paddingInner(BarChartComponent.DEFAULTS.BAR_INNER_PADDING)
                      .paddingOuter(BarChartComponent.DEFAULTS.BAR_OUTER_PADDING)
                      .domain(this.catDomain);

    const valValueRange: [number, number] = this.options.rotate ? [0, this.width] : [this.height, 0];
    this.valScale = d3.scaleLinear().range(this.options.flipCategoryAxis ? valValueRange.reverse() : valValueRange)
                      .domain(this.valDomain)
                      .nice();

    const leftRightAxis = this.options.rotate ? this.catScale : this.valScale;
    if ((this.options.rotate && this.options.flipCategoryAxis) ||
        (!this.options.rotate && this.options.flipValueAxis)) {
      this.scales[Side.RIGHT] = leftRightAxis;
      if (this.options.rotate) {
        this.catSide = Side.RIGHT;
      } else {
        this.valSide = Side.RIGHT;
      }
    } else {
      this.scales[Side.LEFT] = leftRightAxis;
      if (this.options.rotate) {
        this.catSide = Side.LEFT;
      } else {
        this.valSide = Side.LEFT;
      }
    }
    const topBottomAxis = this.options.rotate ? this.valScale : this.catScale;
    if ((this.options.rotate && this.options.flipValueAxis) ||
        (!this.options.rotate && this.options.flipCategoryAxis)) {
      this.scales[Side.TOP] = topBottomAxis;
      if (this.options.rotate) {
        this.valSide = Side.TOP;
      } else {
        this.catSide = Side.TOP;
      }
    } else {
      this.scales[Side.BOTTOM] = topBottomAxis;
      if (this.options.rotate) {
        this.valSide = Side.BOTTOM;
      } else {
        this.catSide = Side.BOTTOM;
      }
    }
  }

  private makeAxis(parent: any, scale: any, side: Side, axisTickArguments?: Array<any>, axisTickValues?: Array<any>): any {
    const axis = ((sc: any, si: Side) => {
      switch (si) {
        case Side.TOP:
          return d3.axisTop(sc);
        case Side.BOTTOM:
          return d3.axisBottom(sc);
        case Side.LEFT:
          return d3.axisLeft(sc);
        case Side.RIGHT:
          return d3.axisRight(sc);
      }
    })(scale, side);
    if (axisTickArguments) {
      axis.tickArguments(axisTickArguments);
    }
    if (axisTickValues) {
      axis.tickValues(axisTickValues);
    }
    const axisPosClass = (side === Side.TOP || side === Side.BOTTOM) ?
                          BarChartComponent.DEFAULTS.CSS.XAXIS : BarChartComponent.DEFAULTS.CSS.YAXIS;
    const axisTypeClass = scale === this.catScale ?
                          BarChartComponent.DEFAULTS.CSS.CATAXIS : BarChartComponent.DEFAULTS.CSS.VALAXIS;
    const axisG = parent.append('g')
                        .attr('class', `${axisPosClass} ${axisTypeClass}`)
                        .call(axis);
    return { axis: axis, g: axisG };
  }

  // this clobbers the existing graphics, if there's any
  private calculateMargins(): void {
    const out: Record<Side, number> = {
                  [Side.TOP]: BarChartComponent.DEFAULTS.MIN_PADDING,
                  [Side.BOTTOM]: BarChartComponent.DEFAULTS.MIN_PADDING,
                  [Side.LEFT]: BarChartComponent.DEFAULTS.MIN_PADDING,
                  [Side.RIGHT]: BarChartComponent.DEFAULTS.MIN_PADDING
                };

    this.initAxes();
    // We *have* to draw axis and labels more or less normally to measure them correctly -
    // this ensures that same css will be applied to labels text. For the same reason I'm not using any temporary container.
    this.baseG.attr('transform', 'translate(-10000, -10000)')
              .selectAll('*').remove();
    let catAxisMeasurements = this.getAxisMeasurements(this.catSide);
    let valAxisMeasurements = this.getAxisMeasurements(this.valSide,
                                [BarChartComponent.DEFAULTS.HINT_TICKS, this._chartDescription.getValueAxisFormatString()]);
    const mainValMargin = catAxisMeasurements.depth;
    const additionalValMargin = Math.ceil(valAxisMeasurements.labelsLength / 2);
    const newValRange = (this.options.rotate ? this.width : this.height) - mainValMargin - additionalValMargin;
    this.valScale.range([0, newValRange]);
    let ticksSpacingFun = (this.valSide === Side.TOP || this.valSide === Side.BOTTOM) ?
                          BarChartComponent.DEFAULTS.MIN_TICKS_SPACING_H : BarChartComponent.DEFAULTS.MIN_TICKS_SPACING_V;
    let baseTickSize = valAxisMeasurements.labelsLength + ticksSpacingFun(valAxisMeasurements.labelsLength) / 2;
    this.valTicks = Math.min(BarChartComponent.DEFAULTS.MAX_TICKS,
                      Math.max(BarChartComponent.DEFAULTS.MIN_TICKS,
                        Math.floor(newValRange / baseTickSize)));
    // the goal here is to find a point where d3 scale.ticks() won't return more ticks than we want -
    // we're very likely to have no space for drawing more. Less is ok.
    this.valTicks = ((vS, vT) => {
      let t = vT;
      let ticks = vS.ticks(t).length;
      while (t > BarChartComponent.DEFAULTS.MIN_TICKS && ticks > vT) {
        t--;
        ticks = vS.ticks(t).length;
      }
      return t;
    })(this.valScale, this.valTicks);
    // console.log(`BarChart: ticks for valAxis: range=[0, ${newValRange}], baseSize=${baseTickSize}, amount=${this.valTicks}`);
    // now we can re-measure value axis with "final" ticks
    valAxisMeasurements = this.getAxisMeasurements(this.valSide, [this.valTicks, this._chartDescription.getValueAxisFormatString()]);
    // ...and then finalize ticks placement calculations for category axis
    const newCatRange = (this.options.rotate ? this.height : this.width) - valAxisMeasurements.depth;
    this.catScale.range([0, newCatRange]);
    catAxisMeasurements = this.getAxisMeasurements(this.catSide);
    ticksSpacingFun = (this.catSide === Side.TOP || this.catSide === Side.BOTTOM) ?
                      BarChartComponent.DEFAULTS.MIN_TICKS_SPACING_H : BarChartComponent.DEFAULTS.MIN_TICKS_SPACING_V;
    baseTickSize = catAxisMeasurements.labelsLength + ticksSpacingFun(catAxisMeasurements.labelsLength) / 2;
    this.catTicks = Math.floor(newCatRange / baseTickSize);
    this.tickDivider = Math.max(1, Math.ceil(catAxisMeasurements.labelsCount / this.catTicks));
    // console.log(`BarChart: calculating divider for hiding ticks, calculated=${this.catTicks}, ` +
    //             `raw=${catAxisMeasurements.labelsCount}, divider=${this.tickDivider}`);

    this.baseG.attr('transform', null)
              .selectAll('*').remove();
    // console.log(`BarChart: labels for catAxis: ` +
    //             `${catAxisMeasurements.labelsLength}x${catAxisMeasurements.labelsDepth}, ` +
    //             `for valAxis: ${valAxisMeasurements.labelsLength}x${valAxisMeasurements.labelsDepth}`);

    const catAxisIsH = (this.catSide === Side.TOP || this.catSide === Side.BOTTOM);
    for (const side in Side) {
      if (this.scales[side]) {
        const getter = (Side[<string>side] === this.catSide) ? catAxisMeasurements : valAxisMeasurements;
        out[side] += getter.depth;
      } else {
        const additionalMarginForValueLabels = ((s: Side) => {
          switch (s) {
            case Side.TOP:
            case Side.BOTTOM:
              return catAxisIsH ? additionalValMargin : 0;
            case Side.LEFT:
            case Side.RIGHT:
              return catAxisIsH ? 0 : additionalValMargin;
          }
        })(Side[<string>side]);
        out[side] += additionalMarginForValueLabels;
      }
    }
    // console.log(`BarChart: margins: ` +
    //             `${out[Side.LEFT]}x${out[Side.TOP]}x${out[Side.RIGHT]}x${out[Side.BOTTOM]}`);
    this.margins = out;
  }

  private getAxisMeasurements(side: Side, axisTickArguments?: Array<any>, axisTickValues?: Array<any>): any {
    const out = { length: 0, depth: 0, labelsLength: 0, labelsDepth: 0, labelsCount: 0 };
    const axisObj = this.makeAxis(this.baseG, this.scales[side], Side[<string>side], axisTickArguments, axisTickValues);
    const axis = axisObj.g;
    const labels = axis.selectAll(`g.tick > text`);
    out.labelsCount = labels.size();
    const maxW = d3.max(labels.nodes(), (l: SVGTextElement) => l.getBBox().width);
    const maxH = d3.max(labels.nodes(), (l: SVGTextElement) => l.getBBox().height);
    if (side === Side.TOP || side === Side.BOTTOM) {
      out.labelsLength = Math.ceil(maxW);
      out.labelsDepth = Math.ceil(maxH);
      out.length = Math.ceil(axis.node().getBBox().width);
      out.depth = Math.ceil(axis.node().getBBox().height);
    } else {
      out.labelsLength = Math.ceil(maxH);
      out.labelsDepth = Math.ceil(maxW);
      out.length = Math.ceil(axis.node().getBBox().height);
      out.depth = Math.ceil(axis.node().getBBox().width);
    }
    return out;
  }

  /*
    "Final" initialization after all necessary preparation steps and before any real drawing happens
  */
  private initChart(): void {
    this.width = this.parentDivWidth - this.margins[Side.LEFT] - this.margins[Side.RIGHT];
    this.height = this.parentDivHeight - this.margins[Side.TOP] - this.margins[Side.BOTTOM];
    this.baseG.attr('transform', `translate(${this.margins[Side.LEFT]}, ${this.margins[Side.TOP]})`);
    this.initAxes();
  }

  private drawAxes(): void {
    for (const side in Side) {
      if (this.scales[side]) {
        let tickArgs = null;
        if (side === this.valSide) {
          tickArgs = [this.valTicks, this._chartDescription.getValueAxisFormatString()];
        }
        const axisObj = this.makeAxis(this.baseG, this.scales[side], Side[<string>side], tickArgs);
        this.axes[side] = axisObj;
        switch (Side[<string>side]) {
          case Side.TOP:
          case Side.LEFT:
            break;
          case Side.BOTTOM:
            axisObj.g.attr('transform', `translate(0, ${this.height})`);
            break;
          case Side.RIGHT:
            axisObj.g.attr('transform', `translate(${this.width}, 0)`);
            break;
        }
        if (side === this.catSide) {
          const ticks = axisObj.g.selectAll('g.tick > text');
          ticks.attr('display', (d, i) => (i % this.tickDivider ? 'none' : 'initial'));
        }
      }
    }
  }

  private drawGridLines(): void {
    // XXX: later
  }

  private drawBars(): void {
    this.barGroups = this.baseG.selectAll('.bar')
                      .data(this._dataObj.data)
                      .enter().append('g')
                      .attr('class', (d, i) => `${BarChartComponent.DEFAULTS.CSS.BAR}`);
    this.bars = this.barGroups.selectAll('.category')
                      .data((d: zluxBarChart.BarChartRecord) => BarChartData.getBarData(d))
                      .enter().append('rect')
                      .attr('class', (d, i) => `${BarChartComponent.DEFAULTS.CSS.CATEGORY}`)
                      .attr('fill', (d, i) => d3.schemeCategory20c[i]);
    const barGX: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
        case Side.BOTTOM:
          return (d: zluxBarChart.BarChartRecord) => this.catScale(BarChartData.getDatumLabel(d));
        case Side.LEFT:
        case Side.RIGHT:
          return (d: zluxBarChart.BarChartRecord) => 0;
      }
    })(this.catSide);
    const barGY: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
        case Side.BOTTOM:
          return (d: zluxBarChart.BarChartRecord) => 0;
        case Side.LEFT:
        case Side.RIGHT:
          return (d: zluxBarChart.BarChartRecord) => this.catScale(BarChartData.getDatumLabel(d));
      }
    })(this.catSide);
    this.barGroups.attr('transform', (d: zluxBarChart.BarChartRecord) => `translate(${barGX(d)},${barGY(d)})`);

    const barX: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
        case Side.BOTTOM:
          return (d: BarRecord) => 0;
        case Side.LEFT:
          return (d: BarRecord) => this.valScale(d.runningTotal);
        case Side.RIGHT:
          return (d: BarRecord) => this.valScale(d.runningTotal + d.value);
      }
    })(this.catSide);
    const barY: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
        return (d: BarRecord) => this.valScale(d.runningTotal);
        case Side.BOTTOM:
          return (d: BarRecord) => this.valScale(d.runningTotal + d.value);
        case Side.LEFT:
        case Side.RIGHT:
          return (d: BarRecord) => 0;
      }
    })(this.catSide);
    const barW: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
        case Side.BOTTOM:
          return (d: BarRecord) => this.catScale.bandwidth();
        case Side.LEFT:
          return (d: BarRecord) => Math.abs(barX(d) - this.valScale(d.runningTotal + d.value));
        case Side.RIGHT:
          return (d: BarRecord) => Math.abs(barX(d) - this.valScale(d.runningTotal));
      }
    })(this.catSide);
    const barH: Function = ((s: Side) => {
      switch (s) {
        case Side.TOP:
          return (d: BarRecord) => Math.abs(barY(d) - this.valScale(d.runningTotal + d.value));
        case Side.BOTTOM:
          return (d: BarRecord) => Math.abs(barY(d) - this.valScale(d.runningTotal));
        case Side.LEFT:
        case Side.RIGHT:
          return (d: BarRecord) => this.catScale.bandwidth();
      }
    })(this.catSide);
    this.bars.attr('x', (d) => barX(d))
             .attr('y', (d) => barY(d))
             .attr('width', (d) => barW(d))
             .attr('height', (d) => barH(d));

    const tooltipFun: Function = (d: BarRecord, i) => {
      const catDesc = this._chartDescription.getCategoryDescription(i);
      let out = `${BarChartData.getDatumLabel(d.record)}`;
      if (catDesc) {
        out += `\n${catDesc.name}: `;
      } else {
        out += `: `;
      }
      out += `${d3.format(this._chartDescription.getValueLabelsFormatString())(d.value)}`;
      return out;
    };
    this.bars.append('svg:title')
              .text(tooltipFun);
  }
}

enum Side {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

interface BarRecord {
  record: zluxBarChart.BarChartRecord;
  runningTotal: number;
  value: number;
  total: number;
}

class BarChartData {
  static getLabel(data: Array<zluxBarChart.BarChartRecord>, index: number): string {
    return BarChartData.getDatumLabel(data[index]);
  }

  static getBarData(data: zluxBarChart.BarChartRecord): Array<BarRecord> {
    const total = BarChartData.getDatumSubTotal(data.values, data.values.length);
    return data.values.map((v: number, i: number, a: Array<number>) => (
      { record: data, value: v, runningTotal: BarChartData.getDatumSubTotal(a, i), total: total }
    ));
  }

  static getDatumSubTotal(data: Array<number>, until: number): number {
    return data.reduce((a, v, i) => (i >= until ? a : a + v), 0);
  }

  static getDatumLabel(data: zluxBarChart.BarChartRecord): string {
    return data.displayName || data.name;
  }

  constructor(public data: Array<zluxBarChart.BarChartRecord>) {}

  getLabel(index: number): string {
    return BarChartData.getLabel(this.data, index);
  }

  /*
    Collapses bar chart values in a way that's convenient for drawing bars
  */
  getBarData(index: number): Array<BarRecord> {
    return BarChartData.getBarData(this.data[index]);
  }
}

class BarChartDescription {
  constructor(public data: zluxBarChart.BarChartDescription) {}

  getCategoryDescription(index: number): zluxBarChart.CategoryDescription {
    return this.data ?
             this.data.categories ?
               this.data.categories.length ?
                 this.data.categories.length > index ? this.data.categories[index] : null : null : null : null;
  }

  getValueAxisFormatString(): string {
    return this.data ?
             this.data.valueAxisFormatString ? this.data.valueAxisFormatString : '' : '';
  }

  getValueLabelsFormatString(): string {
    return this.data ?
             this.data.valueLabelsFormatString ? this.data.valueLabelsFormatString : '' : '';
  }

  getValueDomain(): [number, number] {
    return this.data ?
             this.data.valueDomain ? this.data.valueDomain : null : null;
  }
}

@NgModule({
  imports: [],
  exports: [BarChartComponent, ZluxTableDataToChartPipe],
  declarations: [BarChartComponent, ZluxTableDataToChartPipe]
})
export class ZluxBarChartModule { }


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

