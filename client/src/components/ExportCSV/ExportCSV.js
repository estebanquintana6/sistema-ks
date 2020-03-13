import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function renameLabel (json, oldLabel, newLabel) {
    json["" + newLabel] = json["" + oldLabel];
    delete json["" + oldLabel];
}

export const ExportClientCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';



    const exportToCSV = (csvData, fileName) => {
        for(let i in csvData){
            let data = csvData[i];
            delete data._id;
            delete data.__v;
            delete data.referido1;
            delete data.referido2;

            if(data.productos) data.productos = data.productos.toString();

            let porCerrar = [];
            for(let p in data.porCerrar){
                let prod = data.porCerrar[p];
                if(prod.status !== "No venta"){
                    porCerrar.push(prod.producto);
                }
            }

            data.porCerrar = porCerrar.toString();

            renameLabel(data, "razon_social", "Razon social");
            renameLabel(data, "name", "Nombre");
            renameLabel(data, "last_name1", "Apellido Paterno");
            renameLabel(data, "last_name2", "Apellido Materno");

            renameLabel(data, "calle", "Calle");
            renameLabel(data, "exterior", "Exterior");
            renameLabel(data, "interior", "Interior");
            renameLabel(data, "colonia", "Colonia");
            renameLabel(data, "estado", "Estado");

            renameLabel(data, "sexo", "Sexo");

            renameLabel(data, "cp", "Codigo postal");
            renameLabel(data, "cumpleanos", "Fecha de nacimiento");
            renameLabel(data, "civil", "Estado civil");

            renameLabel(data, "ocupacion", "Ocupacion");

            renameLabel(data, "gastosmedicos", "Gastos medicos");
            renameLabel(data, "segurovida", "Seguro de vida");
            renameLabel(data, "afore", "Afore");

            renameLabel(data, "telefono", "Telefono");
            renameLabel(data, "whatsapp", "Whatsapp");
            renameLabel(data, "email", "Email");

            renameLabel(data, "callDate", "Fecha de llamada");


            renameLabel(data, "productos", "Productos");
            renameLabel(data, "porCerrar", "Posibles ventas");

            renameLabel(data, "comments", "Comentarios");



        }



        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>Exportar a Excel</Button>
    )
}

export const ExportSecomCSV = ({title, csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    
    const exportToCSV = (csvData, fileName) => {
            for(let i in csvData){
                let data = csvData[i];
                delete data._id;
                renameLabel(data, "fecha", "Fecha");
                renameLabel(data, "campana", "Campaña");
                renameLabel(data, "nombreCompleto", "Nombre Completo");
                renameLabel(data, "status", "Estatus");
                renameLabel(data, "callDate", "Fecha de llamada");
                renameLabel(data, "telefono", "Telefono");


            }
            
            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button className="ml-3" variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>{title}</Button>
    )
}