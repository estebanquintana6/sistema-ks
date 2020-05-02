import 'date-fns';
import React, { Component } from "react";
import {
  Button,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import "./InvoicesForm.css"
import moment from 'moment'
import { cloneDeep } from 'lodash'
import {formatShortDate} from '../../component-utils';

class InvoicesForm extends Component {
  constructor(props) {
    super(props);
    if(!this.props.edit){
      this.state = {
        assignee: [""]
      };
    }
  }

  componentWillMount() {
    if (!this.props.edit) return;
    // prepare the invoice data to be rendered in every field
    this.prepareInvoiceForForm();
  }

  prepareInvoiceForForm = () => {
    const auxObj = cloneDeep(this.props.invoice)
    auxObj['edit'] = this.props['edit'];
    this.setState(auxObj);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log('te lo guardo', this.state)
    this.props.updateInvoice(this.state)
  }


  formatDate = (date) => {
    const days = date.split('T')[0]
    return moment(days).startOf('day').format('YYYY-MM-DD')
  }

  render() {
    return (
      <Form id="InvoicesForm" onSubmit={this.onSubmit}>
        <Row>
          <h5 className="swal-title form-title align-left">Recibo</h5>
        </Row>
        <Row>
          <Col>
            <Form.Row>
              <Form.Group as={Col} controlId="invoice">
                <Form.Label>Recibo</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.invoice} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group as={Col} md="12" controlId="due_date">
              <Form.Label>F. Vencimiento</Form.Label>
              <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} md="12" controlId="pay_limit">
              <Form.Label>F. Límite de pago</Form.Label>
              <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.pay_limit)}>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default InvoicesForm;