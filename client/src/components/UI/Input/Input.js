import React from 'react';

import Form from 'react-bootstrap/Form';
import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    
    switch (props.elementType) {
        case( 'input' ):
            inputElement = <Form.Control
            className={classes.inputElement}
            {...props.elementConfig} 
            value={props.value} 
            onChange={props.changed} />;
            break;

        case ( 'textarea' ):
            inputElement = <textarea 
            className={classes.inputElement} 
            {...props.elementConfig} 
            value={props.value} 
            onChange={props.changed} />;
            break;

        default:
            inputElement = <Form.Control 
            className={classes.inputElement} 
            {...props.elementConfig} 
            value={props.value} 
            onChange={props.changed} />
    }

    return (
        <div className={classes.Input} >
            <Form.Label>{props.label}</Form.Label>
            {inputElement}
        </div>
        )
}

export default input;
