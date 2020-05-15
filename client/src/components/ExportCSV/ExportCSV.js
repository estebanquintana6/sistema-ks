import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function renameLabel(json, oldLabel, newLabel) {
    json["" + newLabel] = json["" + oldLabel];
    const res = {[newLabel]: json[oldLabel]}
    delete json["" + oldLabel];
    return res
}
// Cuando tengamos esto, sustituir por el parentKey
// por ejemplo contacts.name -> "Contacto"
const whiteListNames = ['name', 'title', 'policy']

/**
 * Props:
 * - csvData: Data from the entity we want to insert into the excel sheet
 * - fileName: Filename of the file
 * - fieldTranslation: Hash of translation table between original fields and resulting translations
 *   **Important**
 *   This translation is "normalized", even the attributes from the nested objects should be at the same
 *   level in the JSON.
 * 
 *          {
 *            original: translation,
 *            original: translation,
 *            original-nested: translation,
 *          }
 * 
 * - excludedFields: Array of fields to exclude represented in strings
 * - header:  Array of translated strings representing the order of the columns
 */

export const ExportDataToCSV = (props) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const removeExcludedFieldsFromInstance = (dataInstance, excludedFields) => {
        excludedFields.forEach(ef => {
            delete dataInstance[ef]
        })
        return dataInstance
    }

    const transformInnerArrayToObject = (dataArray, fieldTranslation, excludedFields, parentKey) => {
        let resultObj = {}
        dataArray.forEach((loc, index) => {
            let cleanObj = removeExcludedFieldsFromInstance(loc, excludedFields)
            Object.keys(cleanObj).forEach((key) => {
                const translation = whiteListNames.includes(key) ? `${parentKey} ${index + 1}` : `${fieldTranslation[key]} ${index + 1}`;
                resultObj = {...resultObj, ...renameLabel(cleanObj, key, translation)}
            })
        })
        return resultObj
    }

    const spreadInnerObject = (dataObj, fieldTranslation, excludedFields, parentKey) => {
        let resultObj = {}
        let cleanObj = removeExcludedFieldsFromInstance(dataObj, excludedFields)
        Object.keys(cleanObj).forEach((key) => {
            const translation = whiteListNames.includes(key) ? `${parentKey}` : `${parentKey} ${fieldTranslation[key]}`;
            resultObj = {...resultObj, ...renameLabel(cleanObj, key, translation)}
        })
        return resultObj
    }

    const exportToCSV = (csvData, fileName, fieldTranslation, excludedFields, header) => {
        const dataToWrite = []
        // console.log('NEW HEADER', header)

        for (let i in csvData) {
            let resultData = {}
            let data = csvData[i];
            data = {...data, ...resultData}
            data = removeExcludedFieldsFromInstance(data, excludedFields)

            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    resultData = {...resultData, ...transformInnerArrayToObject(data[key], fieldTranslation, excludedFields, fieldTranslation[key])}
                } else if (typeof(data[key]) === 'object'){
                    // treat object
                    resultData = {...resultData, ...spreadInnerObject(data[key], fieldTranslation, excludedFields, fieldTranslation[key])}
                    delete resultData[key]
                } else {
                    resultData = {...resultData, ...renameLabel(data, key, fieldTranslation[key])}
                }
            })
            dataToWrite.push(resultData)
        }

        const workbook = XLSX.utils.book_new();
        const myHeader = header
        // console.log('DEFAULT ORDER', Object.keys(dataToWrite[0]))
        const worksheet = XLSX.utils.json_to_sheet(dataToWrite, {header: myHeader});
        XLSX.utils.book_append_sheet(workbook, worksheet, 'tab1');
        XLSX.writeFile(workbook, `${fileName}.xls`);
    }

    return (
        <Button variant="warning" onClick={(e) => exportToCSV(props.csvData, props.fileName, props.fieldTranslation, props.excludedFields, props.header)}>Exportar a Excel</Button>
    )
}
