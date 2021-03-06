define(["require", "exports", "./timeUtils", "esri/PopupTemplate", "esri/popup/content/TextContent", "esri/popup/content/MediaContent", "esri/popup/FieldInfo", "esri/popup/ExpressionInfo", "./expressionUtils", "esri/popup/content"], function (require, exports, timeUtils_1, PopupTemplate, TextContent, MediaContent, FieldInfo, ExpressionInfo, expressionUtils_1, content_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updatePopupTemplate(params) {
        var currentDate = params.currentDate, rendererType = params.rendererType, existingTemplate = params.existingTemplate, layer = params.layer;
        var popupTemplate;
        switch (rendererType) {
            case "total-infections":
                popupTemplate = createTotalCasesPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "total-deaths":
                popupTemplate = createTotalDeathsPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "total-active":
                popupTemplate = createActiveCasesPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "doubling-time":
                popupTemplate = createNewInfectionsPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "death-rate":
                popupTemplate = createDeathRatePopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "active-rate":
                popupTemplate = createActiveRatePopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "infection-rate-per-100k":
                popupTemplate = createInfectionRatePopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
                break;
            case "new-total":
                popupTemplate = createNewInfectionsPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
            case "dot-density":
                popupTemplate = createSIRsPopupTemplate({
                    currentDate: currentDate,
                    existingTemplate: existingTemplate
                });
            default:
                break;
        }
        layer.popupTemplate = popupTemplate;
    }
    exports.updatePopupTemplate = updatePopupTemplate;
    function createInfectionFieldList(startDate, endDate) {
        var infectionFieldList = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            infectionFieldList.push(timeUtils_1.getFieldFromDate(currentDate));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return infectionFieldList;
    }
    function createTotalCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createTotalInfectionsExpression(currentFieldName),
                name: "total-infections-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalDeathsExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                name: "total-deaths-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalActiveCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                name: "total-active-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalRecoveredCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                name: "total-recovered-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalSusceptibleExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createSusceptiblePopulationExpression(currentFieldName),
                name: "total-susceptible-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalCasesPopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "<b>{expression/total-infections-" + currentFieldName + "}</b> people tested positive for COVID-19 as of " + timeUtils_1.formatDate(currentDate) + "."
            });
            return existingTemplate.clone();
        }
        var expressionInfos = createTotalCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var expressionNameList = expressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var expressionFieldInfos = expressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/total-infections-" + currentFieldName + "}</b> people tested positive for COVID-19 as of " + timeUtils_1.formatDate(currentDate) + "."
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "Total cases over time",
                            value: {
                                fields: expressionNameList
                            }
                        }]
                })
            ],
            fieldInfos: expressionFieldInfos,
            expressionInfos: expressionInfos
        });
    }
    function createTotalDeathsPopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "<b>{expression/total-deaths-" + currentFieldName + "}</b> people died from COVID-19 as of " + timeUtils_1.formatDate(currentDate) + "."
            });
            return existingTemplate.clone();
        }
        var expressionInfos = createTotalDeathsExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var expressionNameList = expressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var expressionFieldInfos = expressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/total-deaths-" + currentFieldName + "}</b> people died from COVID-19 as of " + timeUtils_1.formatDate(currentDate) + "."
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "COVID-19 deaths",
                            value: {
                                fields: expressionNameList
                            }
                        }]
                })
            ],
            fieldInfos: expressionFieldInfos,
            expressionInfos: expressionInfos
        });
    }
    function createActiveCasesPopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "An estimated <b>{expression/" + currentFieldName + "}</b> people were actively sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + "."
            });
            return existingTemplate.clone();
        }
        var expressionInfos = createActiveCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var expressionNameList = expressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var expressionFieldInfos = expressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "An estimated <b>{expression/" + currentFieldName + "}</b> people were actively sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + "."
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "Active cases by day",
                            value: {
                                fields: expressionNameList
                            }
                        }]
                })
            ],
            fieldInfos: expressionFieldInfos.concat([new FieldInfo({
                    fieldName: currentFieldName,
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })]),
            expressionInfos: expressionInfos
        });
    }
    function createActiveCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                name: currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createDoublingTimePopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.\n        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.\n        "
            });
            existingTemplate.expressionInfos = [new ExpressionInfo({
                    expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                    name: "doubling-time",
                    title: "doubling time"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createNewInfectionsExpression(currentFieldName),
                    name: "new-infections",
                    title: "new cases"
                })];
            return existingTemplate.clone();
        }
        var infectionFieldList = createInfectionFieldList(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var infectionFieldInfos = infectionFieldList.map(function (name) {
            return {
                fieldName: name,
                label: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.\n        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.\n        "
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "Total cases over time",
                            value: {
                                fields: infectionFieldList
                            }
                        }]
                })
            ],
            fieldInfos: infectionFieldInfos.concat([
                new FieldInfo({
                    fieldName: currentFieldName,
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/doubling-time",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/new-infections",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ]),
            expressionInfos: [new ExpressionInfo({
                    expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                    name: "doubling-time",
                    title: "doubling time"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createNewInfectionsExpression(currentFieldName),
                    name: "new-infections",
                    title: "new cases"
                })]
        });
    }
    function createNewCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createNewInfectionsAverageExpression(currentFieldName),
                name: "new-cases-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createDoublingTimeExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                name: "doubling-time-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createNewInfectionsPopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.\n        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.\n        "
            });
            var expressionInfosLength = existingTemplate.expressionInfos.length;
            var replacementIndex = expressionInfosLength - 2;
            existingTemplate.expressionInfos.splice(replacementIndex, 2, new ExpressionInfo({
                expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                name: "doubling-time",
                title: "doubling time"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createNewInfectionsExpression(currentFieldName),
                name: "new-infections",
                title: "new cases"
            }));
            return existingTemplate.clone();
        }
        var infectionExpressionInfos = createTotalCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var infectionExpressionNameList = infectionExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var infectionExpressionFieldInfos = infectionExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var newCasesExpressionInfos = createNewCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var newCasesExpressionNameList = newCasesExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var newCasesExpressionFieldInfos = newCasesExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var doublingTimeExpressionInfos = createDoublingTimeExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var doublingTimeExpressionNameList = doublingTimeExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var doublingTimeExpressionFieldInfos = doublingTimeExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.\n        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.\n        "
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "Total cases over time",
                            value: {
                                fields: infectionExpressionNameList
                            }
                        }, {
                            type: "column-chart",
                            title: "7-day rolling average of new cases per day",
                            value: {
                                fields: newCasesExpressionNameList
                            }
                        }, {
                            type: "line-chart",
                            title: "Doubling Time (days)",
                            value: {
                                fields: doublingTimeExpressionNameList
                            }
                        }]
                })
            ],
            fieldInfos: infectionExpressionFieldInfos
                .concat(newCasesExpressionFieldInfos)
                .concat(doublingTimeExpressionFieldInfos)
                .concat([
                new FieldInfo({
                    fieldName: currentFieldName,
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/doubling-time",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/new-infections",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ]),
            expressionInfos: infectionExpressionInfos
                .concat(newCasesExpressionInfos)
                .concat(doublingTimeExpressionInfos)
                .concat([new ExpressionInfo({
                    expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                    name: "doubling-time",
                    title: "doubling time"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createNewInfectionsExpression(currentFieldName),
                    name: "new-infections",
                    title: "new cases"
                })])
        });
    }
    function createDeathRatePopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "<b>{expression/total-deaths}</b> people died due to COVID-19 here, which represents <b>{expression/death-rate}%</b> of the total number of people infected with the virus.\n      "
            });
            existingTemplate.expressionInfos = [new ExpressionInfo({
                    expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                    name: "total-deaths",
                    title: "total deaths"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createDeathRateExpression(currentFieldName),
                    name: "death-rate",
                    title: "death rate"
                })];
            return existingTemplate.clone();
        }
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/total-deaths}</b> people died due to COVID-19 here, which represents <b>{expression/death-rate}%</b> of the total number of people infected with the virus.\n        "
                })
            ],
            fieldInfos: [
                new FieldInfo({
                    fieldName: currentFieldName,
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/total-deaths",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/death-rate",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ],
            expressionInfos: [new ExpressionInfo({
                    expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                    name: "total-deaths",
                    title: "total deaths"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createDeathRateExpression(currentFieldName),
                    name: "death-rate",
                    title: "death rate"
                })]
        });
    }
    function createInfectionRatePopupTemplate(params) {
        var currentDate = params.currentDate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "<b>{expression/total-infections}</b> out of {POPULATION} people tested positive for COVID-19 here. Positive results ocurred in about <b>{expression/infection-rate}</b> for every 100,000 people."
                })
            ],
            fieldInfos: [
                new FieldInfo({
                    fieldName: "POPULATION",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/infection-rate",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/total-infections",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ],
            expressionInfos: [new ExpressionInfo({
                    expression: expressionUtils_1.createInfectionRateExpression(currentFieldName),
                    name: "infection-rate",
                    title: "Infection rate"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createTotalInfectionsExpression(currentFieldName),
                    name: "total-infections",
                    title: "Total cases"
                })]
        });
    }
    function createActiveRatePopupTemplate(params) {
        var currentDate = params.currentDate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "An estimated <b>{expression/active-infections}</b> out of {POPULATION} people were sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + " here. That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people."
                })
            ],
            fieldInfos: [
                new FieldInfo({
                    fieldName: "POPULATION",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active-rate",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active-infections",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ],
            expressionInfos: [new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesPer100kExpression(currentFieldName),
                    name: "active-rate",
                    title: "Active rate"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                    name: "active-infections",
                    title: "Active cases"
                })]
        });
    }
    function createSIRsPopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "An estimated <b>{expression/active}</b> out of {POPULATION} people were sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + " here. That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people."
            });
            existingTemplate.content[1] = new content_1.FieldsContent({
                fieldInfos: [new FieldInfo({
                        fieldName: "expression/active",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/recovered",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/deaths",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/total",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    })]
            });
            var expressionInfosLength = existingTemplate.expressionInfos.length;
            var replacementIndex = expressionInfosLength - 5;
            existingTemplate.expressionInfos.splice(replacementIndex, 5, new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                name: "active",
                title: "Active cases (est.)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                name: "recovered",
                title: "Recovered (est.)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                name: "deaths",
                title: "Deaths"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesPer100kExpression(currentFieldName),
                name: "active-rate",
                title: "Active rate"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createTotalInfectionsExpression(currentFieldName),
                name: "total",
                title: "Total cases"
            }));
            return existingTemplate.clone();
        }
        var activeExpressionInfos = createTotalActiveCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var activeExpressionNameList = activeExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var activeExpressionFieldInfos = activeExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var deathsExpressionInfos = createTotalDeathsExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var deathsExpressionNameList = deathsExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var deathsExpressionFieldInfos = deathsExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var recoveredExpressionInfos = createTotalRecoveredCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var recoveredExpressionNameList = recoveredExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var recoveredExpressionFieldInfos = recoveredExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "An estimated <b>{expression/active}</b> out of {POPULATION} people were sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + " here. That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people."
                }),
                new content_1.FieldsContent({
                    fieldInfos: [new FieldInfo({
                            fieldName: "expression/active",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/recovered",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/deaths",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/total",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        })]
                }),
                new MediaContent({
                    mediaInfos: [{
                            type: "line-chart",
                            title: "Active cases",
                            value: {
                                fields: activeExpressionNameList
                            }
                        }, {
                            type: "line-chart",
                            title: "Recovered cases",
                            value: {
                                fields: recoveredExpressionNameList
                            }
                        }, {
                            type: "line-chart",
                            title: "Deaths",
                            value: {
                                fields: deathsExpressionNameList
                            }
                        }]
                })
            ],
            fieldInfos: activeExpressionFieldInfos
                .concat(recoveredExpressionFieldInfos)
                .concat(deathsExpressionFieldInfos)
                .concat([
                new FieldInfo({
                    fieldName: "POPULATION",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/recovered",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/deaths",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active-rate",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ]),
            expressionInfos: activeExpressionInfos
                .concat(recoveredExpressionInfos)
                .concat(deathsExpressionInfos)
                .concat([new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                    name: "active",
                    title: "Active cases (est.)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                    name: "recovered",
                    title: "Recovered (est.)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                    name: "deaths",
                    title: "Deaths"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesPer100kExpression(currentFieldName),
                    name: "active-rate",
                    title: "Active rate"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createTotalInfectionsExpression(currentFieldName),
                    name: "total",
                    title: "Total cases"
                })])
        });
    }
});
//# sourceMappingURL=popupTemplateUtils.js.map