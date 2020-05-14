import React from  'react'

class DataList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredOptions: [],
            textValue: this.props.value
        }
        this.handleClick = this.handleClick.bind(this);
        this.showList = this.showList.bind(this);
        this.hideList = this.hideList.bind(this);
    }

    updateFilter(evt) {
        let value = '';

        if (evt) {
            value = evt.target.value;
        }

        let filteredOptions = [];

        for (let i = 0;i<this.props.options.length;i++) { // this is the idea of creating div//
            const item = this.props.options[i];
            if (item.value.indexOf(value) != -1) {
                filteredOptions.push({
                    id: item.id,
                    value: item.value
                });
            }
        }

        this.setState({
            filteredOptions: filteredOptions,
            textValue: value,
        });
    }



    handleClick(option){
        console.log(option)
        this.props.onSelectUser(option.id)
        this.setState({textValue: option.value})
        this.hideList();
    }

    showList() {
        this.setState({
            expanded: true
        });
    }

    hideList() { // whe we click that name after by this function the list hide.
        this.setState({
             expanded: false
        });
    }

    render() {

        let displayList = this.state.filteredOptions.map((option) => {
            return (<div data-id={option.id} onClick={()=>this.handleClick(option)}>{option.value}</div>)
        })


        const  { textValue } = this.state;
        return(

        <div>
            <input type="text" className="form-control" value={textValue}  onChange={this.updateFilter.bind(this)} onFocus={this.showList}/>
            <div>
            {
                this.state.expanded && displayList
            }
            </div>

        </div>
    )
    }
}


export default DataList;