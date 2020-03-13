import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';

export default class DataTable extends Component {
  data = {
    columns: [
      {
        label: 'Nombre',
        field: 'name',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Domicilio',
        field: 'address',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Hora de llegada',
        field: 'enter_time',
        sort: 'asc',
        width: 200
      },
      {
        label: 'No. Personas',
        field: 'number_persons',
        sort: 'asc',
        width: 100
      }
    ],
    rows: [
      {
        name: "Javier Rodriguez",
        address: "Privada camino real 114",
        enter_time: "4:20",
        number_persons: "1"
      },
      {
        name: "Mario Molina",
        address: "Jesus Oviedo 120",
        enter_time: "19:20",
        number_persons: "3"
      },
      {
        name: "Goku",
        address: "Namekusei",
        enter_time: "12:30",
        number_persons: "8"
      },
      {
        name: "Ral",
        address: "Su casa",
        enter_time: "11:30",
        number_persons: "1"
      },
      {
        name: "Erikiano",
        address: "La Paz",
        enter_time: "21:30",
        number_persons: "3"
      },
      {
        name: "Diego Ballesteros",
        address: "Atotonilco",
        enter_time: "12:30",
        number_persons: "1"
      },
      {
        name: "Christian Solis",
        address: "La choza del orco",
        enter_time: "18:14",
        number_persons: "3"
      },
      {
        name: "Chabelo",
        address: "El Olimpo",
        enter_time: "17:12",
        number_persons: "5"
      },
      {
        name: "Berni Ortega",
        address: "El teatrito",
        enter_time: "5:22",
        number_persons: "1"
      },
      {
        name: "Esteban Quintana",
        address: "Calle 13",
        enter_time: "13:28",
        number_persons: "1"
      },
      {
        name: "Andrés Manuel López Obrador",
        address: "Los Pinos",
        enter_time: "15:10",
        number_persons: "99"
      },
      {
        name: "Peña Nieto",
        address: "not Los Pinos",
        enter_time: "12:30",
        number_persons: "1"
      },
      {
        name: "Salinas de Gortari",
        address: "Su casita",
        enter_time: "12:30",
        number_persons: "1"
      },
      {
        name: "Vicente Fox",
        address: "Su rancho",
        enter_time: "12:30",
        number_persons: "42"
      },
      {
        name: "Rafa Olvera",
        address: "Privada camino real 112",
        enter_time: "2:35",
        number_persons: "1"
      },
      {
        name: "Mitchel Solis",
        address: "Con Chrismas",
        enter_time: "10:28",
        number_persons: "8"
      },
      {
        name: "Atom TM",
        address: "Mutek",
        enter_time: "5:23",
        number_persons: "8"
      },
      {
        name: "Goku",
        address: "Namekusei",
        enter_time: "12:30",
        number_persons: "8"
      }
    ]
  };
  render() {
    return (
      <MDBDataTable
        hover
        small
        data={this.data}
        scrollY
        maxHeight="200pt"
        searching={false}
      />
    );
  }
}
