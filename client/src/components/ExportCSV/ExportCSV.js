import React from 'react'
import Button from 'react-bootstrap/Button';
import * as XLSX from 'xlsx';
import moment from 'moment'
import {formatShortDate} from '../component-utils';

function renameLabel(json, oldLabel, newLabel) {
    if (!newLabel) return
    json["" + newLabel] = json["" + oldLabel]
    const tmp = json["" + oldLabel]
    const tmpDate = moment(tmp, moment.ISO_8601)
    if (tmpDate.isValid()) {
        json[oldLabel] = tmpDate.format('DD-MM-YYYY')
    }
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

    const removeExcludedFieldsFromInstance = (dataInstance, excludedFields) => {
        excludedFields.forEach(ef => {
            if(ef != null)
                if(dataInstance.hasOwnProperty(ef)) delete dataInstance[ef]
        })
        return dataInstance
    }

    const transformInnerArrayToObject = (dataArray, fieldTranslation, excludedFields, parentKey, isContactsField = false) => {
        let resultObj = {}
        dataArray.forEach((loc, index) => {
            let cleanObj = removeExcludedFieldsFromInstance(loc, excludedFields)
            if(isContactsField){
                if(!cleanObj.hasOwnProperty('name')) cleanObj.name = '';
                if(!cleanObj.hasOwnProperty('email')) cleanObj.email = '';
                if(!cleanObj.hasOwnProperty('telephone')) cleanObj.telephone = '';
            }
            Object.keys(cleanObj).forEach((key) => {
                const translation = whiteListNames.includes(key) ? `${parentKey} ${index + 1}` : `${fieldTranslation[key]} ${index + 1}`;
                resultObj = {...resultObj, ...renameLabel(cleanObj, key, translation)}
            })
        })
        return resultObj
    }

    const transformInvoiceToObject = (dataArray, fieldTranslation, excludedFields, parentKey, isContactsField = false) => {
        let resultObj = {}
        dataArray.forEach((loc, index) => {
            let cleanObj = removeExcludedFieldsFromInstance(loc, excludedFields)
            if(isContactsField){
                if(!cleanObj.hasOwnProperty('name')) cleanObj.name = '';
                if(!cleanObj.hasOwnProperty('email')) cleanObj.email = '';
                if(!cleanObj.hasOwnProperty('telephone')) cleanObj.telephone = '';
            }
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

    const invoiceToObj = (dataObj) => {
        let mappedObj = dataObj.map((invoice) => {
            //EMPRESA	PRIMA 	RECIBOS	STATUS
            let result = {}
            
            invoice.client ? result["EMPRESA"] = invoice.client.name : result["EMPRESA"] = "";
            invoice.insurance ? result["PRODUCTO"] = invoice.insurance.insurance_type : result["PRODUCTO"] = "";
            invoice.invoice ? result["RECIBO"] = invoice.invoice : result["RECIBO"] = "";
            invoice.bounty ? result["PRIMA"] = invoice.bounty : result["PRIMA"] = "";
            invoice.due_date ? result["VENCIMIENTO DE PAGO"] = formatShortDate(invoice.due_date) : result["VENCIMIENTO DE PAGO"] = "";
            invoice.payment_status ? result["STATUS"] = invoice.payment_status : result["STATUS"] = "";

            return result;
        });

        mappedObj.sort(function(a, b){
        if(a.EMPRESA < b.EMPRESA) { return -1; }
        if(a.EMPRESA > b.EMPRESA) { return 1; }
            return 0;
        })

        return mappedObj;
    }

    const exportToCSV = (csvData, fileName, fieldTranslation, excludedFields, header, type = "", sortableColumn = '', refresh) => {
        console.log(csvData);
        if(!csvData.length) {
            refresh();
            return;
        }
        const dataToWrite = [];
        if(type === "invoices"){
            let obj = invoiceToObj(csvData);
            obj.map((ob) => dataToWrite.push(ob))
        } else {
            for (let i in csvData) {
                let resultData = {}
                let data = csvData[i];
                data = {...data, ...resultData}
                data = removeExcludedFieldsFromInstance(data, excludedFields)

                Object.keys(data).forEach(key => {

                    if (Array.isArray(data[key])) {
                        if(key === 'invoices'){
                            resultData = {...resultData, ...transformInvoiceToObject(data[key], fieldTranslation, ['client', 'comments', 'email', 'insurance', 'pay_limit', 'pay_limit2', 'status', '__v', '_id'], fieldTranslation[key], key === 'contacts')}             
                        } else{
                            resultData = {...resultData, ...transformInnerArrayToObject(data[key], fieldTranslation, excludedFields, fieldTranslation[key], key === 'contacts')}
                        }
                    } else if (typeof(data[key]) === 'object' && !!data[key]){
                        // treat object
                        resultData = {...resultData, ...spreadInnerObject(data[key], fieldTranslation, excludedFields, fieldTranslation[key])}
                        delete resultData[key]
                    } else {
                        if(key === 'colective_insurance'){
                            resultData = {...resultData, ...{'Tipo de póliza': data[key] === true ? 'Colectivo' : 'Individual'}}
                        }else{
                            resultData = {...resultData, ...renameLabel(data, key, fieldTranslation[key])}
                        }
                    }
                    if(key === 'car_year' && !!resultData['Modelo']){
                        resultData['Modelo'] = resultData['Modelo'].split('-')[2]
                    }
                })
                dataToWrite.push(resultData)
            }
        }
        dataToWrite.sort(function(a, b){
            if(a[sortableColumn] < b[sortableColumn]) { return -1; }
            if(a[sortableColumn] > b[sortableColumn]) { return 1; }
                return 0;
            })
        const workbook = XLSX.utils.book_new();
        let myHeader = header

        const worksheet = XLSX.utils.json_to_sheet(dataToWrite, {header: myHeader});
        XLSX.utils.book_append_sheet(workbook, worksheet, 'tab1');
        XLSX.writeFile(workbook, `${fileName}.xls`);
        refresh()
    }

    return (
        <Button variant="warning" onClick={(e) => exportToCSV(props.csvData, props.fileName, props.fieldTranslation, props.excludedFields, props.header, props.type, props.sortableColumn, props.onComplete)}>Exportar a Excel</Button>
    )
}
