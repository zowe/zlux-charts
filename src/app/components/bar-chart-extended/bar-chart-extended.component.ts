
/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
import { NgModule, Component, Input, ViewChild,
         OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

import * as zluxBarChart from './bar-chart-extended.interfaces';
import { ZluxTableDataToChartExtendedDataPipe } from './bar-chart-extended-input.pipe';

@Component({
  selector: 'zlux-bar-chart-extended',
  templateUrl: './bar-chart-extended.component.html',
  styleUrls: ['./bar-chart-extended.component.css']
})
export class BarChartExtendedComponent implements OnChanges {
  @ViewChild('container') container: any;
  @ViewChild('chart') chart: any;

  @Input() data: zluxBarChart.BarChartData;
  @Input() categories: Array<zluxBarChart.BarChartCategory>;
  @Input() invertAxes: boolean = false;

  private width: number;
  private height: number;
  private parentDivHeight: any;
  private parentDivWidth: any;
  private margin: any;
  private x: any;
  private y: any;
  private xAxis: any;
  private yAxis: any;
  private svg: any;
  private g: any;
  private state: any;
  private viewBoxValues: any;
  private newH: any;
  private invertAxis: any;
  private xLabel;
  private yLabel;
  private bars;
  private domainLabel: string;
  private rangeLabel: string;
  private rotation: any;
  private xDistanceLabel: any;
  private yDistanceLabel: any;
  private textAnchor: any;
  private fontSizeX: any;
  private fontSizeY: any;
  private xAxisDetails: any;
  private tickDivider: any;
  private minDistance: any;

  constructor() {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log(this.data);

    // Remove duplicates if categories changed
    if(JSON.stringify(simpleChanges.categories.currentValue) !== JSON.stringify(simpleChanges.categories.previousValue)) {
      this.categories = this.removeCategoryDuplicates(this.categories);
    }

    const dataLength = Object.keys(this.data).length;
    if (dataLength > 0) {
      this.createMargin(this.invertAxes);
      this.initSvg();
      this.formatTickLabel();
      this.initAxis(this.invertAxes);
      this.axisLabel(this.invertAxes);
      this.drawAxis(this.invertAxes);
      this.drawBars(this.invertAxes);
      this.minTickDistance();
      this.collapseTicks();
      this.formatTickDisplayX();
      this.formatTickDisplayY(this.invertAxes);
      // d3.select(this.barChart.nativeElement.parentElement.parentElement.parentElement).on('resize', this.resizeWindow);
      // this.resizeWindow(this.invertAxis);
    }
  }

  private removeCategoryDuplicates(categories: Array<zluxBarChart.BarChartCategory>): Array<zluxBarChart.BarChartCategory> {
    let result: Array<zluxBarChart.BarChartCategory> = [];
    categories.forEach(c => {
      const isCategoryPresented = result.some(r => r.field === c.field);
      if(!isCategoryPresented) {
        result.push(c);
      }
    });

    return result;
  }

  /*
    When the barcharts are inverted the margins necessary to display the entire graph are changed.
    Method allocates margin depending on whether invertAxes is true or false
  */
  private createMargin(invertAxis: boolean) {
    this.margin = invertAxis ? {top: 20, right: 30, bottom: 20, left:80} : {top: 10, right: 20, bottom: 40, left:45};
  }

  private initSvg() {
    this.parentDivHeight = this.container.nativeElement.clientHeight - this.margin.bottom;
    this.parentDivWidth = this.container.nativeElement.clientWidth - this.margin.right;
    this.svg = d3.select(this.chart.nativeElement);
    this.svg
      .attr('width', this.parentDivWidth)
      .attr('height', this.parentDivHeight)
      .attr('class', 'svg-content')
    this.width = this.parentDivWidth - this.margin.left - this.margin.right;
    this.height = this.parentDivHeight - this.margin.top - this.margin.bottom;
    this.g = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }


  /*
    The following prevents x axis labels from getting cut off
    The way the SVG is drawn will sometimes cause the x axis tick labels to get cut off due to the length.
    The following will alter the rotation if the length is >= 3
  */
  private formatTickLabel() {
    const maxLabelLength = this.categories
                                  .map(c => c.displayName?c.displayName:c.field)
                                  .map(l => l.length)
                                  .reduce((a, b) => Math.max(a, b));

    if (maxLabelLength >= 5) {
      this.rotation = 'rotate(-20)';
      this.xDistanceLabel = '-3';
      this.yDistanceLabel = '5';
      this.textAnchor = 'end';
    }
    else if (maxLabelLength >= 3) {
      this.rotation = 'rotate(-25)';
      this.xDistanceLabel = '-3';
      this.yDistanceLabel = '5';
      this.textAnchor = 'end';
    }
    else {
      this.rotation = 'rotate(0)'
      this.xDistanceLabel='0';
      this.yDistanceLabel='9';
      this.textAnchor = 'middle';
    }
  }

  /*
    To switch between invertAxes and vertical barcharts we look at the workspace json for the boolean value of INVERT_XAXIS_AND_YAXIS
    The functionality behind the next methods takes in the boolean value and shows the correct orientation.
    The x value and the y value, and domain are essentially switched (inverted the axis)
  */
  private initAxis(invertAxes: boolean) {
    this.initXAxis(invertAxes);
    this.initYAxis(invertAxes);
  }

  private initXAxis(invertAxis: boolean) {
    this.x = invertAxis ? d3.scaleLinear().range([0, this.width]) : d3.scaleBand().range([0, this.width]).padding(0.2);
    if(invertAxis) {
      // Hack to get values of object
      let values = Object.keys(this.data).map(k => this.data[k]);
      this.x.domain([0, d3.max(values)]);
    } else {
      this.x.domain(this.categories.map((c) => c.field));
    }
  }

  private initYAxis(invertAxis: boolean) {
    this.y = invertAxis ? d3.scaleBand().range([this.height, 0]).padding(0.2) : d3.scaleLinear().range([this.height, 0]);
    if(invertAxis) {
      this.y.domain(this.categories.map((c) => c.field));
    } else {
      // Hack to get values of object
      let values = Object.keys(this.data).map(k => this.data[k]);
      this.y.domain([0, d3.max(values)]);
    }
  }

  // X and Y axis Labeling changes depending on orientation
  private axisLabel(invertAxis: boolean) {
    this.domainLabel = invertAxis ? this.yLabel : this.xLabel
    this.rangeLabel = invertAxis ? this.xLabel : this.yLabel;
  }

  /*
    For drawAxis, the core functionality behind drawing the two axis is the same. The difference is the external styling
    that is necessary for traditional(vertical) bar charts, as the x labels need to be rotated.
  */
  private drawAxis(invertAxes: boolean) {
    const bottomAxis = d3.axisBottom(this.x);
    const leftAxis = d3.axisLeft(this.y);

    if(invertAxes) {
      leftAxis.tickFormat(l => this.formatCategoryTick(l));
    } else {
      bottomAxis.tickFormat(l => this.formatCategoryTick(l));
    }

    // Base x axis
    this.xAxis = this.g.append('g')
                       .attr('class', 'x-axis')
                       .attr('transform', 'translate(0,' + this.height + ')')
                       .call(bottomAxis);
    // Base y axis
    this.yAxis = this.g.append('g')
                       .attr('class', 'y-axis')
                       .call(leftAxis);

    // Alter each based on rotation
    if (invertAxes) {
      this.xAxis.selectAll('text')
                .attr('font-size', this.fontSizeX)
                .style('font-weight', '500');
      this.yAxis.selectAll('text')
                .attr('font-size', this.fontSizeY)
                .style('font-weight', '500');
    }
    else {
      this.xAxis.selectAll('text')
                .attr('font-size', this.fontSizeX)
                .attr('transform', this.rotation)
                .attr('y', this.yDistanceLabel)
                .attr('x', this.xDistanceLabel)
                .attr('text-anchor', this.textAnchor)
                .style('font-weight', '500');
      this.yAxis.selectAll('text')
                .attr('font-size', this.fontSizeY)
                .style('font-weight', '500');
    }
  }

  private formatCategoryTick(field: any): string {
    const category = this.categories.filter(c => c.field === field)[0];
    if(category) {
      return category.displayName?category.displayName:category.field;
    }
    return "";
  }


  private drawBars(invertAxis: boolean) {
    const formattedData = this.formatData(this.data);

    this.bars = this.g.selectAll('.bar')
                      .data(formattedData)
                      .enter().append('rect')
                      .style('fill', 'steelblue')
                      .attr('class', 'bar')
    if (invertAxis) {
      this.bars.attr('x', 1)
               .attr('width', (d) => this.x(d.value))
               .attr('y', (d) => this.y(d.category))
               .attr('height', this.y.bandwidth());
    }
    else {
      this.bars.attr('x', (d) => this.x(d.category))
               .attr('y', (d) => this.y(d.value))
               .attr('width', this.x.bandwidth())
               .attr('height', (d) => this.height - this.y(d.value));
    }

    /*
      An extremely easy way to create tooltips on d3 bar charts without using an external library
    */
    let tooltipCategory = 'Category';
    let tooltipValue = 'Value';
    this.bars.append('svg:title')
             .text((d) => tooltipCategory + ': ' + d.category + '\n' + tooltipValue + ': ' + d.value);
  }

  /*
     Format data to struct: [{category, value}]
  */
  private formatData(data: any) {
    return Object.keys(data).map(k => { return {category: k, value: this.data[k]} });
  }

  /*
    formatTickDisplayX and formatTickDisplayY handle tick spacing so when resize happens, the ticks and labels do not crunch together.
    collapseTicks handles tick distance resizing when the size of the view changes. Prevents labels from beign scrunched together
  */
  private minTickDistance() {
    this.minDistance = 40;
  }

  private floor(x: number, y: number) {
    return Math.floor(x/y)
  }

  private collapseTicks() {
    // Get info about x-axis(width, height, etc)
    let xAxisDetails = this.chart.nativeElement.childNodes[0].getBBox();
    let tickAmount = this.getDataLength(this.data);
    let xAxisWidth = xAxisDetails.width;
    let tickDistance = xAxisWidth / tickAmount;
    this.tickDivider = (tickDistance < this.minDistance) ? this.floor(this.minDistance, tickDistance) : 1;
  }

  private formatTickDisplayX() {
    let ticks = d3.select(this.chart.nativeElement).selectAll('.x-axis .tick text');
    ticks.style('display', (d, i) => (i % this.tickDivider) ? 'none' : 'initial');
  }

  private formatTickDisplayY(invertAxis: boolean) {
    if (!invertAxis) {
      let ticks = d3.selectAll('.y-axis .tick text')
      ticks.style('display', (d, i) => (i % 2) ? 'none' : 'initial')
    }
  }
}

@NgModule({
  imports: [],
  exports: [BarChartExtendedComponent, ZluxTableDataToChartExtendedDataPipe],
  declarations: [BarChartExtendedComponent, ZluxTableDataToChartExtendedDataPipe]
})
export class ZluxBarChartExtendedModule { }

/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/
