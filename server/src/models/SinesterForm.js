var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sinester = new Schema({
    type: {
        type: String,
        required: false,
        uppercase: true
    },
    status: {
        type: String,
        enum: ['DOCUMENTOS', 'PROCESO', 'REQUERIMIENTO', 'RECHAZO', 'PAGADO'],
        required: false
    },
    ramo: {
        type: String,
        required: false
    },
    //CONTRATANTE 	ASEGURADORA	NO DE POLIZA	NO DE SINIESTRO	FECHA DE SINIESTRO	FECHA FIN 	TIPO DE SINIESTRO	ESTATUS
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    affected: {
        type: String,
        required: false,
        uppercase: true
    },
    folio: {
        type: String,
        required: false,
        uppercase: true
    },
    sinester: {
        type: String,
        required: false,
        uppercase: true
    },
    begin_date: {
        type: Date,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['DOCUMENTOS', 'PROCESO', 'REQUERIMIENTO', 'RECHAZO', 'PAGADO'],
        required: false
    },
    description: {
        type: String,
        required: false
    },
    history: {
        type: [
            new mongoose.Schema({
                date: {
                    type: Date,
                    required: false
                },
                status: {
                    type: String,
                    required: false
                }
            })]
    },
    files: {
        type: [
            new mongoose.Schema({
                path: {
                    type: String,
                    required: true
                },
                created_at: {
                    type: Date,
                    required: false,
                    default: Date.now
                },
                description: {
                    type: String,
                    required: false,
                    default: ""
                }
            }
            )],
        default: []
    },
}, {
    collection: 'Sinesters'
});

module.exports = Sinester = mongoose.model('Sinester', Sinester);