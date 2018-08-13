

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

define("@zlux/charts", ["@angular/core","d3"], function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_5__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ZluxChartPipe = (function () {
        function ZluxChartPipe() {
        }
        ZluxChartPipe.prototype.mapColumns = function (value, categoryColumnId, valueColumnIds) {
            if (value && value.metaData && value.rows) {
                var columnMetaData = value.metaData.columnMetaData ?
                    value.metaData.columnMetaData : (value.metaData instanceof Array ? value.metaData : null);
                if (columnMetaData && columnMetaData.length > 0) {
                    var categoryColumn = this.mapCatColumn(categoryColumnId, columnMetaData);
                    var valueColumns = this.mapValueColumns(valueColumnIds, columnMetaData, categoryColumn);
                    if (valueColumns == null) {
                        return null;
                    }
                    return { categoryColumn: categoryColumn, valueColumns: valueColumns };
                }
            }
            return null;
        };
        ZluxChartPipe.prototype.mapCatColumn = function (inputColId, columnMetaData) {
            if (inputColId) {
                if (columnMetaData.some(function (c) { return c.columnIdentifier === inputColId; })) {
                    return inputColId;
                }
                else {
                    console.error("ZluxChartPipe: category column reference not found: " + inputColId);
                }
            }
            var potentialCats = columnMetaData.filter(function (c) { return c.rawDataType && c.rawDataType === 'string'; });
            if (potentialCats.length > 0) {
                return potentialCats[0].columnIdentifier;
            }
            else if (columnMetaData.length > 1) {
                return columnMetaData[0].columnIdentifier;
            }
            else {
                return null;
            }
        };
        ZluxChartPipe.prototype.mapValueColumns = function (inputColIds, columnMetaData, reserved) {
            if (inputColIds instanceof Array && inputColIds.length > 0) {
                var goodRefs_1 = [];
                inputColIds.forEach(function (colId) {
                    var searchResult = columnMetaData.filter(function (c) { return c.columnIdentifier === colId; });
                    if (searchResult.length > 0) {
                        goodRefs_1.push(colId);
                    }
                    else {
                        console.error("ZluxChartPipe: value column reference not found: " + colId);
                    }
                });
                if (goodRefs_1.length > 0) {
                    return goodRefs_1;
                }
            }
            var potentialCols = columnMetaData.filter(function (c) { return c.rawDataType && c.rawDataType === 'number'; });
            if (potentialCols.length > 0) {
                return potentialCols[0].columnIdentifier !== reserved ? [potentialCols[0].columnIdentifier] :
                    (potentialCols.length > 1 ? [potentialCols[1].columnIdentifier] : null);
            }
            return null;
        };
        return ZluxChartPipe;
    }());
    exports.ZluxChartPipe = ZluxChartPipe;
    var ZluxTableDataToChartPipe = (function (_super) {
        __extends(ZluxTableDataToChartPipe, _super);
        function ZluxTableDataToChartPipe() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ZluxTableDataToChartPipe.prototype.transform = function (value, categoryColumnId, valueColumnIds) {
            var mapping = this.mapColumns(value, categoryColumnId, valueColumnIds);
            if (mapping) {
                var out = value.rows.map(function (row, i) { return ({
                    name: mapping.categoryColumn ? row[mapping.categoryColumn] : (i + ''),
                    values: mapping.valueColumns.map(function (vColId) { return row[vColId]; })
                }); });
                return out;
            }
            console.error("zluxTableDataToChart: fatal: can't filter input table data.");
            return [];
        };
        ZluxTableDataToChartPipe = __decorate([
            core_1.Pipe({ name: 'zluxTableDataToChart' })
        ], ZluxTableDataToChartPipe);
        return ZluxTableDataToChartPipe;
    }(ZluxChartPipe));
    exports.ZluxTableDataToChartPipe = ZluxTableDataToChartPipe;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, bar_chart_component_1, bar_chart_input_pipe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZluxBarChartModule = bar_chart_component_1.ZluxBarChartModule;
    exports.BarChartComponent = bar_chart_component_1.BarChartComponent;
    exports.ZluxTableDataToChartPipe = bar_chart_input_pipe_1.ZluxTableDataToChartPipe;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(6), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, d3, zluxBarChart, bar_chart_input_pipe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BarChartComponent = (function () {
        function BarChartComponent() {
            this._chartDescription = new BarChartDescription(null);
        }
        BarChartComponent_1 = BarChartComponent;
        Object.defineProperty(BarChartComponent.prototype, "data", {
            get: function () {
                return this._dataObj ? this._dataObj.data : null;
            },
            set: function (newData) {
                if (!this._dataObj || this._dataObj.data !== newData) {
                    this._dataObj = new BarChartData(newData);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BarChartComponent.prototype, "chartDescription", {
            get: function () {
                return this._chartDescription ? this._chartDescription.data : null;
            },
            set: function (newChartDescription) {
                if (!this._chartDescription || this._chartDescription.data !== newChartDescription) {
                    this._chartDescription = new BarChartDescription(newChartDescription);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BarChartComponent.prototype, "chartOptions", {
            get: function () {
                return this._options;
            },
            set: function (newOptions) {
                if (this._options !== newOptions) {
                    this._options = newOptions;
                    this.options = this.initSettings(newOptions);
                }
            },
            enumerable: true,
            configurable: true
        });
        BarChartComponent.prototype.ngOnChanges = function (changes) {
            if (changes.chartOptions || changes.data || changes.chartDescription) {
                this.draw();
            }
        };
        BarChartComponent.prototype.draw = function () {
            if (this._dataObj.data.length > 0) {
                this.initData();
                this.initSvg();
                this.calculateMargins();
                this.initChart();
                this.drawAxes();
                this.drawBars();
            }
        };
        BarChartComponent.prototype.initSettings = function (options) {
            var out = __assign({}, options);
            out.flipValueAxis = out.flipValueAxis || false;
            out.flipCategoryAxis = out.flipCategoryAxis || false;
            out.rotate = out.rotate || false;
            return out;
        };
        BarChartComponent.prototype.initData = function () {
            this.margins = (_a = {}, _a[Side.TOP] = 0, _a[Side.BOTTOM] = 0, _a[Side.LEFT] = 0, _a[Side.RIGHT] = 0, _a);
            this.scales = (_b = {}, _b[Side.TOP] = null, _b[Side.BOTTOM] = null, _b[Side.LEFT] = null, _b[Side.RIGHT] = null, _b);
            this.axes = (_c = {}, _c[Side.TOP] = null, _c[Side.BOTTOM] = null, _c[Side.LEFT] = null, _c[Side.RIGHT] = null, _c);
            this.catDomain = this._dataObj.data.map(function (d) { return BarChartData.getDatumLabel(d); });
            this.valDomain = [0, d3.max(this._dataObj.data.map(function (d) { return d.values.reduce((function (a, v) { return a + v; }), 0); }))];
            if (this._chartDescription.getValueDomain()) {
                var descDomain = this._chartDescription.getValueDomain();
                if (descDomain[0] < this.valDomain[0]) {
                    this.valDomain[0] = descDomain[0];
                }
                if (descDomain[1] > this.valDomain[1]) {
                    this.valDomain[1] = descDomain[1];
                }
            }
            var _a, _b, _c;
        };
        BarChartComponent.prototype.initSvg = function () {
            this.svg = d3.select(this.chart.nativeElement);
            this.svg.selectAll('*').remove();
            this.svg
                .attr('width', 0)
                .attr('height', 0);
            this.parentDivHeight = Math.floor(this.container.nativeElement.getBoundingClientRect().height);
            this.parentDivWidth = Math.floor(this.container.nativeElement.getBoundingClientRect().width);
            this.svg
                .attr('width', this.parentDivWidth)
                .attr('height', this.parentDivHeight);
            this.baseG = this.svg.append('g');
            this.width = this.parentDivWidth;
            this.height = this.parentDivHeight;
        };
        BarChartComponent.prototype.initAxes = function () {
            var catValueRange = this.options.rotate ? [0, this.height] : [0, this.width];
            this.catScale = d3.scaleBand().range(catValueRange)
                .paddingInner(BarChartComponent_1.DEFAULTS.BAR_INNER_PADDING)
                .paddingOuter(BarChartComponent_1.DEFAULTS.BAR_OUTER_PADDING)
                .domain(this.catDomain);
            var valValueRange = this.options.rotate ? [0, this.width] : [this.height, 0];
            this.valScale = d3.scaleLinear().range(this.options.flipCategoryAxis ? valValueRange.reverse() : valValueRange)
                .domain(this.valDomain)
                .nice();
            var leftRightAxis = this.options.rotate ? this.catScale : this.valScale;
            if ((this.options.rotate && this.options.flipCategoryAxis) ||
                (!this.options.rotate && this.options.flipValueAxis)) {
                this.scales[Side.RIGHT] = leftRightAxis;
                if (this.options.rotate) {
                    this.catSide = Side.RIGHT;
                }
                else {
                    this.valSide = Side.RIGHT;
                }
            }
            else {
                this.scales[Side.LEFT] = leftRightAxis;
                if (this.options.rotate) {
                    this.catSide = Side.LEFT;
                }
                else {
                    this.valSide = Side.LEFT;
                }
            }
            var topBottomAxis = this.options.rotate ? this.valScale : this.catScale;
            if ((this.options.rotate && this.options.flipValueAxis) ||
                (!this.options.rotate && this.options.flipCategoryAxis)) {
                this.scales[Side.TOP] = topBottomAxis;
                if (this.options.rotate) {
                    this.valSide = Side.TOP;
                }
                else {
                    this.catSide = Side.TOP;
                }
            }
            else {
                this.scales[Side.BOTTOM] = topBottomAxis;
                if (this.options.rotate) {
                    this.valSide = Side.BOTTOM;
                }
                else {
                    this.catSide = Side.BOTTOM;
                }
            }
        };
        BarChartComponent.prototype.makeAxis = function (parent, scale, side, axisTickArguments, axisTickValues) {
            var axis = (function (sc, si) {
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
            var axisPosClass = (side === Side.TOP || side === Side.BOTTOM) ?
                BarChartComponent_1.DEFAULTS.CSS.XAXIS : BarChartComponent_1.DEFAULTS.CSS.YAXIS;
            var axisTypeClass = scale === this.catScale ?
                BarChartComponent_1.DEFAULTS.CSS.CATAXIS : BarChartComponent_1.DEFAULTS.CSS.VALAXIS;
            var axisG = parent.append('g')
                .attr('class', axisPosClass + " " + axisTypeClass)
                .call(axis);
            return { axis: axis, g: axisG };
        };
        BarChartComponent.prototype.calculateMargins = function () {
            var out = (_a = {},
                _a[Side.TOP] = BarChartComponent_1.DEFAULTS.MIN_PADDING,
                _a[Side.BOTTOM] = BarChartComponent_1.DEFAULTS.MIN_PADDING,
                _a[Side.LEFT] = BarChartComponent_1.DEFAULTS.MIN_PADDING,
                _a[Side.RIGHT] = BarChartComponent_1.DEFAULTS.MIN_PADDING,
                _a);
            this.initAxes();
            this.baseG.attr('transform', 'translate(-10000, -10000)')
                .selectAll('*').remove();
            var catAxisMeasurements = this.getAxisMeasurements(this.catSide);
            var valAxisMeasurements = this.getAxisMeasurements(this.valSide, [BarChartComponent_1.DEFAULTS.HINT_TICKS, this._chartDescription.getValueAxisFormatString()]);
            var mainValMargin = catAxisMeasurements.depth;
            var additionalValMargin = Math.ceil(valAxisMeasurements.labelsLength / 2);
            var newValRange = (this.options.rotate ? this.width : this.height) - mainValMargin - additionalValMargin;
            this.valScale.range([0, newValRange]);
            var ticksSpacingFun = (this.valSide === Side.TOP || this.valSide === Side.BOTTOM) ?
                BarChartComponent_1.DEFAULTS.MIN_TICKS_SPACING_H : BarChartComponent_1.DEFAULTS.MIN_TICKS_SPACING_V;
            var baseTickSize = valAxisMeasurements.labelsLength + ticksSpacingFun(valAxisMeasurements.labelsLength) / 2;
            this.valTicks = Math.min(BarChartComponent_1.DEFAULTS.MAX_TICKS, Math.max(BarChartComponent_1.DEFAULTS.MIN_TICKS, Math.floor(newValRange / baseTickSize)));
            this.valTicks = (function (vS, vT) {
                var t = vT;
                var ticks = vS.ticks(t).length;
                while (t > BarChartComponent_1.DEFAULTS.MIN_TICKS && ticks > vT) {
                    t--;
                    ticks = vS.ticks(t).length;
                }
                return t;
            })(this.valScale, this.valTicks);
            valAxisMeasurements = this.getAxisMeasurements(this.valSide, [this.valTicks, this._chartDescription.getValueAxisFormatString()]);
            var newCatRange = (this.options.rotate ? this.height : this.width) - valAxisMeasurements.depth;
            this.catScale.range([0, newCatRange]);
            catAxisMeasurements = this.getAxisMeasurements(this.catSide);
            ticksSpacingFun = (this.catSide === Side.TOP || this.catSide === Side.BOTTOM) ?
                BarChartComponent_1.DEFAULTS.MIN_TICKS_SPACING_H : BarChartComponent_1.DEFAULTS.MIN_TICKS_SPACING_V;
            baseTickSize = catAxisMeasurements.labelsLength + ticksSpacingFun(catAxisMeasurements.labelsLength) / 2;
            this.catTicks = Math.floor(newCatRange / baseTickSize);
            this.tickDivider = Math.max(1, Math.ceil(catAxisMeasurements.labelsCount / this.catTicks));
            this.baseG.attr('transform', null)
                .selectAll('*').remove();
            var catAxisIsH = (this.catSide === Side.TOP || this.catSide === Side.BOTTOM);
            for (var side in Side) {
                if (this.scales[side]) {
                    var getter = (Side[side] === this.catSide) ? catAxisMeasurements : valAxisMeasurements;
                    out[side] += getter.depth;
                }
                else {
                    var additionalMarginForValueLabels = (function (s) {
                        switch (s) {
                            case Side.TOP:
                            case Side.BOTTOM:
                                return catAxisIsH ? additionalValMargin : 0;
                            case Side.LEFT:
                            case Side.RIGHT:
                                return catAxisIsH ? 0 : additionalValMargin;
                        }
                    })(Side[side]);
                    out[side] += additionalMarginForValueLabels;
                }
            }
            this.margins = out;
            var _a;
        };
        BarChartComponent.prototype.getAxisMeasurements = function (side, axisTickArguments, axisTickValues) {
            var out = { length: 0, depth: 0, labelsLength: 0, labelsDepth: 0, labelsCount: 0 };
            var axisObj = this.makeAxis(this.baseG, this.scales[side], Side[side], axisTickArguments, axisTickValues);
            var axis = axisObj.g;
            var labels = axis.selectAll("g.tick > text");
            out.labelsCount = labels.size();
            var maxW = d3.max(labels.nodes(), function (l) { return l.getBBox().width; });
            var maxH = d3.max(labels.nodes(), function (l) { return l.getBBox().height; });
            if (side === Side.TOP || side === Side.BOTTOM) {
                out.labelsLength = Math.ceil(maxW);
                out.labelsDepth = Math.ceil(maxH);
                out.length = Math.ceil(axis.node().getBBox().width);
                out.depth = Math.ceil(axis.node().getBBox().height);
            }
            else {
                out.labelsLength = Math.ceil(maxH);
                out.labelsDepth = Math.ceil(maxW);
                out.length = Math.ceil(axis.node().getBBox().height);
                out.depth = Math.ceil(axis.node().getBBox().width);
            }
            return out;
        };
        BarChartComponent.prototype.initChart = function () {
            this.width = this.parentDivWidth - this.margins[Side.LEFT] - this.margins[Side.RIGHT];
            this.height = this.parentDivHeight - this.margins[Side.TOP] - this.margins[Side.BOTTOM];
            this.baseG.attr('transform', "translate(" + this.margins[Side.LEFT] + ", " + this.margins[Side.TOP] + ")");
            this.initAxes();
        };
        BarChartComponent.prototype.drawAxes = function () {
            var _this = this;
            for (var side in Side) {
                if (this.scales[side]) {
                    var tickArgs = null;
                    if (side === this.valSide) {
                        tickArgs = [this.valTicks, this._chartDescription.getValueAxisFormatString()];
                    }
                    var axisObj = this.makeAxis(this.baseG, this.scales[side], Side[side], tickArgs);
                    this.axes[side] = axisObj;
                    switch (Side[side]) {
                        case Side.TOP:
                        case Side.LEFT:
                            break;
                        case Side.BOTTOM:
                            axisObj.g.attr('transform', "translate(0, " + this.height + ")");
                            break;
                        case Side.RIGHT:
                            axisObj.g.attr('transform', "translate(" + this.width + ", 0)");
                            break;
                    }
                    if (side === this.catSide) {
                        var ticks = axisObj.g.selectAll('g.tick > text');
                        ticks.attr('display', function (d, i) { return (i % _this.tickDivider ? 'none' : 'initial'); });
                    }
                }
            }
        };
        BarChartComponent.prototype.drawGridLines = function () {
        };
        BarChartComponent.prototype.drawBars = function () {
            var _this = this;
            this.barGroups = this.baseG.selectAll('.bar')
                .data(this._dataObj.data)
                .enter().append('g')
                .attr('class', function (d, i) { return "" + BarChartComponent_1.DEFAULTS.CSS.BAR; });
            this.bars = this.barGroups.selectAll('.category')
                .data(function (d) { return BarChartData.getBarData(d); })
                .enter().append('rect')
                .attr('class', function (d, i) { return "" + BarChartComponent_1.DEFAULTS.CSS.CATEGORY; })
                .attr('fill', function (d, i) { return d3.schemeCategory20c[i]; });
            var barGX = (function (s) {
                switch (s) {
                    case Side.TOP:
                    case Side.BOTTOM:
                        return function (d) { return _this.catScale(BarChartData.getDatumLabel(d)); };
                    case Side.LEFT:
                    case Side.RIGHT:
                        return function (d) { return 0; };
                }
            })(this.catSide);
            var barGY = (function (s) {
                switch (s) {
                    case Side.TOP:
                    case Side.BOTTOM:
                        return function (d) { return 0; };
                    case Side.LEFT:
                    case Side.RIGHT:
                        return function (d) { return _this.catScale(BarChartData.getDatumLabel(d)); };
                }
            })(this.catSide);
            this.barGroups.attr('transform', function (d) { return "translate(" + barGX(d) + "," + barGY(d) + ")"; });
            var barX = (function (s) {
                switch (s) {
                    case Side.TOP:
                    case Side.BOTTOM:
                        return function (d) { return 0; };
                    case Side.LEFT:
                        return function (d) { return _this.valScale(d.runningTotal); };
                    case Side.RIGHT:
                        return function (d) { return _this.valScale(d.runningTotal + d.value); };
                }
            })(this.catSide);
            var barY = (function (s) {
                switch (s) {
                    case Side.TOP:
                        return function (d) { return _this.valScale(d.runningTotal); };
                    case Side.BOTTOM:
                        return function (d) { return _this.valScale(d.runningTotal + d.value); };
                    case Side.LEFT:
                    case Side.RIGHT:
                        return function (d) { return 0; };
                }
            })(this.catSide);
            var barW = (function (s) {
                switch (s) {
                    case Side.TOP:
                    case Side.BOTTOM:
                        return function (d) { return _this.catScale.bandwidth(); };
                    case Side.LEFT:
                        return function (d) { return Math.abs(barX(d) - _this.valScale(d.runningTotal + d.value)); };
                    case Side.RIGHT:
                        return function (d) { return Math.abs(barX(d) - _this.valScale(d.runningTotal)); };
                }
            })(this.catSide);
            var barH = (function (s) {
                switch (s) {
                    case Side.TOP:
                        return function (d) { return Math.abs(barY(d) - _this.valScale(d.runningTotal + d.value)); };
                    case Side.BOTTOM:
                        return function (d) { return Math.abs(barY(d) - _this.valScale(d.runningTotal)); };
                    case Side.LEFT:
                    case Side.RIGHT:
                        return function (d) { return _this.catScale.bandwidth(); };
                }
            })(this.catSide);
            this.bars.attr('x', function (d) { return barX(d); })
                .attr('y', function (d) { return barY(d); })
                .attr('width', function (d) { return barW(d); })
                .attr('height', function (d) { return barH(d); });
            var tooltipFun = function (d, i) {
                var catDesc = _this._chartDescription.getCategoryDescription(i);
                var out = "" + BarChartData.getDatumLabel(d.record);
                if (catDesc) {
                    out += "\n" + catDesc.name + ": ";
                }
                else {
                    out += ": ";
                }
                out += "" + d3.format(_this._chartDescription.getValueLabelsFormatString())(d.value);
                return out;
            };
            this.bars.append('svg:title')
                .text(tooltipFun);
        };
        BarChartComponent.DEFAULTS = {
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
            MIN_PADDING: 3,
            MIN_TICKS_SPACING_V: (function (x) { return 0.4 * x + 3; }),
            MIN_TICKS_SPACING_H: (function (x) { return 0.2 * x + 3; }),
            MIN_TICKS: 2,
            MAX_TICKS: 20,
            HINT_TICKS: 10
        };
        __decorate([
            core_1.Input(),
            __metadata("design:type", Array),
            __metadata("design:paramtypes", [Array])
        ], BarChartComponent.prototype, "data", null);
        __decorate([
            core_1.Input(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [Object])
        ], BarChartComponent.prototype, "chartDescription", null);
        __decorate([
            core_1.Input(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [Object])
        ], BarChartComponent.prototype, "chartOptions", null);
        __decorate([
            core_1.ViewChild('container'),
            __metadata("design:type", Object)
        ], BarChartComponent.prototype, "container", void 0);
        __decorate([
            core_1.ViewChild('chart'),
            __metadata("design:type", Object)
        ], BarChartComponent.prototype, "chart", void 0);
        BarChartComponent = BarChartComponent_1 = __decorate([
            core_1.Component({
                selector: 'zlux-bar-chart',
                template: __webpack_require__(7),
                styles: [__webpack_require__(8)]
            }),
            __metadata("design:paramtypes", [])
        ], BarChartComponent);
        return BarChartComponent;
        var BarChartComponent_1;
    }());
    exports.BarChartComponent = BarChartComponent;
    var Side;
    (function (Side) {
        Side["TOP"] = "TOP";
        Side["BOTTOM"] = "BOTTOM";
        Side["LEFT"] = "LEFT";
        Side["RIGHT"] = "RIGHT";
    })(Side || (Side = {}));
    var BarChartData = (function () {
        function BarChartData(data) {
            this.data = data;
        }
        BarChartData.getLabel = function (data, index) {
            return BarChartData.getDatumLabel(data[index]);
        };
        BarChartData.getBarData = function (data) {
            var total = BarChartData.getDatumSubTotal(data.values, data.values.length);
            return data.values.map(function (v, i, a) { return ({ record: data, value: v, runningTotal: BarChartData.getDatumSubTotal(a, i), total: total }); });
        };
        BarChartData.getDatumSubTotal = function (data, until) {
            return data.reduce(function (a, v, i) { return (i >= until ? a : a + v); }, 0);
        };
        BarChartData.getDatumLabel = function (data) {
            return data.displayName || data.name;
        };
        BarChartData.prototype.getLabel = function (index) {
            return BarChartData.getLabel(this.data, index);
        };
        BarChartData.prototype.getBarData = function (index) {
            return BarChartData.getBarData(this.data[index]);
        };
        return BarChartData;
    }());
    var BarChartDescription = (function () {
        function BarChartDescription(data) {
            this.data = data;
        }
        BarChartDescription.prototype.getCategoryDescription = function (index) {
            return this.data ?
                this.data.categories ?
                    this.data.categories.length ?
                        this.data.categories.length > index ? this.data.categories[index] : null : null : null : null;
        };
        BarChartDescription.prototype.getValueAxisFormatString = function () {
            return this.data ?
                this.data.valueAxisFormatString ? this.data.valueAxisFormatString : '' : '';
        };
        BarChartDescription.prototype.getValueLabelsFormatString = function () {
            return this.data ?
                this.data.valueLabelsFormatString ? this.data.valueLabelsFormatString : '' : '';
        };
        BarChartDescription.prototype.getValueDomain = function () {
            return this.data ?
                this.data.valueDomain ? this.data.valueDomain : null : null;
        };
        return BarChartDescription;
    }());
    var ZluxBarChartModule = (function () {
        function ZluxBarChartModule() {
        }
        ZluxBarChartModule = __decorate([
            core_1.NgModule({
                imports: [],
                exports: [BarChartComponent, bar_chart_input_pipe_1.ZluxTableDataToChartPipe],
                declarations: [BarChartComponent, bar_chart_input_pipe_1.ZluxTableDataToChartPipe]
            })
        ], ZluxBarChartModule);
        return ZluxBarChartModule;
    }());
    exports.ZluxBarChartModule = ZluxBarChartModule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=\"bar-chart-container\" #container>\r\n  <svg class=\"bar-chart\" #chart></svg>\r\n</div>\r\n";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = ":host {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.bar-chart-container {\r\n  flex: 1 1 auto;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.bar-chart {\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n"

/***/ })
/******/ ])});;
//# sourceMappingURL=index.js.map

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

