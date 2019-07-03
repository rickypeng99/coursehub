import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'


class MainPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: null
        }

    }

    componentDidMount(){
        this.setState({
            username: localStorage.getItem('user')
        })

    }

    


    logout = ((event) => {
        localStorage.removeItem('user');
        this.setState({
                    username: localStorage.getItem('user')
                })    
    })

    render() {

        if(this.state.username != null){
            return (

            
                <div>
                    <p>
                        Hello, {this.state.username}
                    </p>
                    <Button onClick = {this.logout}>Logout</Button>
                </div>
    
            )
        } else{
            return(
                <p>Fuck</p>
            )
        }

       

    }


}

export default MainPage;