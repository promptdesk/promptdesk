class JSONMapper {
    
    //create empty constructor
    constructor() {}

    isInteger(s) {
        if (s.startsWith('-')) {
            return !isNaN(s.substring(1));
        }
        return !isNaN(s);
    }

    getFromDict(dataDict, mapPath, defaultValue) {
        if (mapPath === null) {
            return defaultValue;
        }
        const keys = mapPath.split('.');
        let collectedValues = [];
        
        let self = this;
        function recurse(data, keys) {
            if (keys.length === 0) {
                return data;
            }
            let key = keys[0];
            if (key === "*") {
                if (!Array.isArray(data)) {
                    return defaultValue;
                }
                for (let item of data) {
                    let result = recurse(item, keys.slice(1));
                    if (result !== null) {
                        collectedValues.push(...(Array.isArray(result) ? result : [result]));
                    }
                }
            } else if (self.isInteger(key)) {
                key = parseInt(key);
                // Check if key is a positive index or a valid negative index
                if (key >= 0 && Array.isArray(data) && data.length > key) {
                    return recurse(data[key], keys.slice(1));
                } else if (key < 0 && Array.isArray(data) && -key <= data.length) {
                    return recurse(data[data.length + key], keys.slice(1));
                } else {
                    return defaultValue;
                }
            } else {
                if (typeof data === 'object' && data !== null && key in data) {
                    return recurse(data[key], keys.slice(1));
                } else {
                    return defaultValue;
                }
            }
            return collectedValues;
        }
    
        const result = recurse(dataDict, keys);
        return collectedValues.length > 0 ? collectedValues : result;
    }

    applySubrules(sourceItem, subrules) {
        let tempObject = {};
        for (let subrule of subrules) {
            let sourceValue = this.getFromDict(sourceItem, subrule['sourceField'], subrule['default'] || null);
            if (sourceValue === null) {
                sourceValue = subrule['default'];
            }
            // Check for transformation rule
            if (subrule.hasOwnProperty("transformation")) {
                sourceValue = this.transformValue(sourceValue, subrule["transformation"]);
            }
            this.setInDict(tempObject, subrule['targetField'], sourceValue, subrule['appendTo'] || false, subrule['prependTo'] || false);
        }
        return tempObject;
    }

    setInDict(dataDict, mapPath, value, appendTo = false, prependTo = false) {
        const keys = mapPath.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            let key = keys[i];
            if (this.isInteger(key)) {
                key = parseInt(key);
                while (key >= dataDict.length) {
                    dataDict.push({});
                }
                dataDict = dataDict[key];
            } else {
                if (i < keys.length - 2 && !isNaN(keys[i + 1])) {  // Next key is a digit, ensure a list
                    dataDict = dataDict[key] || (dataDict[key] = []);
                } else {
                    dataDict = dataDict[key] || (dataDict[key] = {});
                }
            }
        }
        if (appendTo || prependTo) {
            // Ensure the target is a list
            if (!dataDict[keys[keys.length - 1]] || !Array.isArray(dataDict[keys[keys.length - 1]])) {
                dataDict[keys[keys.length - 1]] = [];
            }
            if (appendTo) {
                dataDict[keys[keys.length - 1]].push(value);
            } else if (prependTo) {
                dataDict[keys[keys.length - 1]].unshift(value);
            }
        } else {
            // Handle the last key for direct set
            if (this.isInteger(keys[keys.length - 1])) {
                let lastKey = parseInt(keys[keys.length - 1]);
                while (lastKey >= dataDict.length) {
                    dataDict.push(null);
                }
                dataDict[lastKey] = value;
            } else {
                dataDict[keys[keys.length - 1]] = value;
            }
        }
    }

    transformValue(value, transformationRules) {
        const conditions = transformationRules.conditions || [];
        for (let condition of conditions) {
            if (condition.when.field === "value") {
                if (value === condition.when.equals) {
                    return condition.transformTo;
                }
            }
        }
    
        // keep for last
        const textConditions = transformationRules.text || [];
        for (let condition of textConditions) {
            if (condition === "uppercase") {
                return value.toUpperCase();
            } else if (condition === "lowercase") {
                return value.toLowerCase();
            } else if (condition === "strip") {
                return value.trim();
            }
        }
    
        return value;  // Return original value if no conditions met
    }

    checkConditions(conditions, sourceJson, rule) {
        for (let condition of conditions) {
            let sourceValue = this.getFromDict(sourceJson, condition['sourceField'], null);
            if (condition['check'] === 'equals') {
                return sourceValue === condition['value'];
            } else if (condition['check'] === 'not-equals') {
                return sourceValue !== condition['value'];
            } else if (condition['check'] === 'exists') {
                return sourceValue !== null;
            } else {
                throw new Error(`Unsupported check: ${rule['check']}`);
            }
        }
    }

    applyMapping(sourceJson, mappingRules) {
        let targetJson = {};
        let tempStorage = {};
    
        // Process rules to either directly set values or prepare them for grouped appending
        for (let rule of mappingRules) {
            // Process non-array mappings as before
            let sourceValue = this.getFromDict(sourceJson, rule['sourceField'], rule['default'] || null);
            if ("conditions" in rule) {
                let isConditionMet = this.checkConditions(rule["conditions"], sourceJson, rule);
                if (!isConditionMet) {
                    continue;
                }
            }
            if (rule['action'] === 'mapArray' && 'subRules' in rule) {
                // Handle nested array mapping
                let sourceArray = this.getFromDict(sourceJson, rule['sourceField'], rule['default'] || null);
                if (Array.isArray(sourceArray)) {
                    let mappedArray = sourceArray.map(item => this.applySubrules(item, rule['subRules']));
                    this.setInDict(targetJson, rule['targetField'], mappedArray, rule['appendTo'] || false, rule['prependTo'] || false);
                }
            } else {
                if ("transformation" in rule) {
                    sourceValue = this.transformValue(sourceValue, rule["transformation"]);
                }
                if ('groupId' in rule) {
                    if (!(rule['groupId'] in tempStorage)) {
                        tempStorage[rule['groupId']] = {};
                    }
                    tempStorage[rule['groupId']][rule['targetField']] = sourceValue;
                } else {
                    if (!('targetField' in rule)) {
                        return sourceValue;
                    }
                    this.setInDict(targetJson, rule['targetField'], sourceValue, rule['appendTo'] || false);
                }
            }
        }
    
        // Append/prepend grouped items from temporary storage to the target structure
        for (let groupId in tempStorage) {
            let data = tempStorage[groupId];
            let appendTarget = null;
            let prependTarget = null;
            for (let rule of mappingRules) {
                if (rule['groupId'] === groupId) {
                    if ('appendTo' in rule) {
                        appendTarget = rule['appendTo'];
                    } else if ('prependTo' in rule) {
                        prependTarget = rule['prependTo'];
                    }
                    break;
                }
            }
            if (appendTarget) {
                this.setInDict(targetJson, appendTarget, data, true);
            } else if (prependTarget) {
                this.setInDict(targetJson, prependTarget, data, false, true);
            }
        }
    
        return targetJson;
    }

}

module.exports = { JSONMapper };