import 'date-fns';
import React, { Component } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Jumbotron
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
    this.props.updateInvoice(this.state)
  }


  formatDate = (date) => {
    if(date){
      const days = date.split('T')[0]
      return moment(days).startOf('day').format('YYYY-MM-DD')
    }
  }

  render() {
    return (
      <Form id="InvoicesForm" onSubmit={this.onSubmit}>
        <Row>
          <h5 className="swal-title form-title align-left">Recibo</h5>
        </Row>
        <Jumbotron>
          <Row>
            <Col>
              <Form.Row>
                <Form.Group as={Col} controlId="invoice">
                  <Form.Label>Recibo</Form.Label>
                  <Form.Control required onChange={this.onChange} value={this.state.invoice} />
                </Form.Group>
                <Form.Group as={Col} controlId="payment_status">
                  <Form.Label>Estatus</Form.Label>
                  <Form.Control required as="select" onChange={this.onChange} value={this.state.payment_status}>
                    <option></option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="VENCIDO">Vencido</option>
                    <option value="SALDO A FAVOR">Saldo a Favor</option>
                    <option value="CANCELADO">Cancelado</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Col>
          </Row>
          <Row>
              <Form.Group as={Col} controlId="due_date">
                <Form.Label>Fecha límite de pago</Form.Label>
                <Form.Control type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="pay_limit">
                <Form.Label>Vigencia de</Form.Label>
                <Form.Control type="date" onChange={this.onChange} value={this.formatDate(this.state.pay_limit)}>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="pay_limit2">
                <Form.Label>Vigencia a</Form.Label>
                <Form.Control type="date" onChange={this.onChange} value={this.formatDate(this.state.pay_limit2)}>
                </Form.Control>
              </Form.Group>
          </Row>
          <Row>
              <Form.Group as={Col} controlId="bounty">
                <Form.Label>Prima total</Form.Label>
                <Form.Control onChange={this.onChange} value={this.state.bounty}>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="net_bounty">
                <Form.Label>Prima neta</Form.Label>
                <Form.Control onChange={this.onChange} value={this.state.net_bounty}>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="payment_method">
                <Form.Label>Forma de pago</Form.Label>
                <Form.Control onChange={this.onChange} value={this.state.payment_method}>
                </Form.Control>
              </Form.Group>
          </Row>
          <Row>
            <Col>
              <Form.Row>
                <Form.Group as={Col} controlId="comments">
                  <Form.Label>Comentarios</Form.Label>
                  <Form.Control onChange={this.onChange} value={this.state.comments} />
                </Form.Group>
              </Form.Row>
            </Col>
            <Col>
              <Form.Row>
                <Form.Group as={Col} controlId="email">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control onChange={this.onChange} value={this.state.email} />
                </Form.Group>
              </Form.Row>
            </Col>
          </Row>
          <Row>
            <Form.Row>
            <Form.Group as={Col} md="4" controlId="promoter">
            </Form.Group>
                <Form.Label>Promotora</Form.Label>
                <Form.Control onChange={this.onChange} value={this.state.promoter} />
            </Form.Row>
          </Row>
          <Row>
            <Col>
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Comentarios de email</Form.Label>
                  <Form.Control as="textarea" onChange={ this.onChange } value={this.state.email_comment} />
                </Form.Group>
              </Form.Row>
            </Col>
          </Row>
        </Jumbotron>

        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default InvoicesForm;