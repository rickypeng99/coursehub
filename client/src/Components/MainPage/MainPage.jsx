import React, { Component } from 'react'
import { Button, Input, Card, Icon, Form, Dropdown } from 'semantic-ui-react'
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import axios from 'axios';

class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: null,
            loggedIn: false,
            tempQuery: "",
            query: "",
            courses: [],
            loaded: false,
            searched: false
        }
        this.query = "";
    }

    componentDidMount() {
        /**
         * load current logged in user's information
         */
        this.setState({
            username: this.props.user,
            loggedIn: this.props.loggedIn
        })

        /**
         * load all courses
         */

        axios.get('api/course')
            .then(result => {
                var courses = result.data.data
                this.setState({
                    courses: courses,
                    loaded: true
                })
            })
            .catch(error => {
                console.log(error)
            })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn !== this.state.loggedIn) {
            this.setState(
                {
                    username: nextProps.user,
                    loggedIn: nextProps.loggedIn
                });
        }
    }

    login = (() => {
        this.props.history.push('/login')
    })

    logout = (() => {
        this.props.dispatch(userActions.logout());
        this.setState({
            username: this.props.username,
            loggedIn: this.props.loggedIn
        })
    })

    register = (() => {
        this.props.history.push('/register')
    })


    queryFilter = ((course) => {
        var courseName = course['dept'] + course['idx'] + " - " + course['title'];
        return courseName.toLowerCase().includes(this.state.query.toLowerCase());
    })

    queryHandler = ((event) => {
        this.setState({ tempQuery: event.target.value })
        //this.setState({ [event.target.name]: event.target.value });

    })

    searchHandler = (() => {
        var query = this.state.tempQuery;
        this.setState({
            query: query,
            searched: true
        });
    })

    enterCourse = ((value) => {
        this.props.history.push('/course/' + value)
    })

    preventDragHandler = (e) => {
        e.preventDefault();
    }
    render() {


        var query = this.state.tempQuery
        var loaded = this.state
        const inputBoxStyle = {
            textAlign: "center",
            marginBottom: "20px",
            width: "100%"

        }

        const inputStyle = {
            width: "50%"
        }
        const mainStyle = {

            marginTop: "10%"

        }

        const mainStyleWithoutSearch = {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

        }
        const imgStyle = {
            //width: "50%",
            width: "30%",
            margin: "10px",
            userDrag: "none",
            userSelect: "none",
            //cursor: "pointer"
        }
        if (!this.state.loggedIn) {
            //console.log(this.state.username)
            return (


                <div style={mainStyleWithoutSearch}>
                    <img style={imgStyle} src={require('../../Common/images/mainLogo.png')} onDragStart={this.preventDragHandler} />

                    <div style={inputBoxStyle}>
                        <Button primary onClick = {()=>{this.props.history.push('/login')}}>Login</Button>
                    </div>

                </div>

            )
        } else {
            if (loaded) {

                var courseCards = this.state.courses.filter(this.queryFilter).map((course, index) => {
                    var liStyle = {
                        marginBottom: "10px",
                        marginLeft: "5px",
                        marginRight: "5px",
                    }
                    var card = {
                        height: "100px",
                        cursor: 'pointer',

                    }


                    var courseName = course['dept'] + course['idx'] + " " + course['title'] + " - " + course.session;

                    return (
                        <div style={liStyle} >
                            <Card style={card} onClick={() => this.enterCourse(course.CRN)} key={course.CRN}>
                                <Card.Content>
                                    <Card.Header>{courseName}</Card.Header>
                                    <Card.Description>
                                        {course.CRN}
                                    </Card.Description>
                                </Card.Content>

                            </Card>
                        </div>

                    )
                })
                var cardGroup = {
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    listStyleType: "none"
                }
                const options = [
                    { key: 'CS', text: 'CS', value: 'CS' },
                    { key: 'ECE', text: 'ECE', value: 'ECE' }
                ]
                
                if (this.state.searched) {
                    return (
                        <div style={mainStyle}>
                            <div style={inputBoxStyle}>
                                <SearchInput
                                    inputStyle={inputStyle}
                                    query={query}
                                    searchHandler={this.searchHandler}
                                    queryHandler={this.queryHandler}
                                >
                                </SearchInput>


                            </div>
                            <div style={cardGroup}>
                                {courseCards}
                            </div>
                        </div>


                    )
                }

                else {
                    
                    return (
                        <div style={mainStyleWithoutSearch}>
                            <img style={imgStyle} src={require('../../Common/images/mainLogo.png')} onDragStart={this.preventDragHandler} />

                            <div style={inputBoxStyle}>

                                <SearchInput
                                    inputStyle={inputStyle}
                                    query={query}
                                    searchHandler={this.searchHandler}
                                    queryHandler={this.queryHandler}
                                >
                                </SearchInput>

                            </div>

                        </div>
                    )

                }



            }

            else {
                return (
                    <p>Loaidng</p>
                )
            }

        }
    }
}


function SearchInput(props) {
    return (
        <Input
            style={props.inputStyle}
            size='massive'
            //icon='search'
            placeholder='Search by course number or keywords'

            value={props.query}
            name="query"
            icon={<Icon name='search' inverted circular link onClick={props.searchHandler}
            />}
            //label={<Dropdown defaultValue='CS' options={options} />}
            //labelPosition='right'
            onChange={props.queryHandler}
        />
    )
}


function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};


const mainPage = (props) => {



    return (

        <MainPage {...props}></MainPage>

    )
}

const connectedMainPage = connect(mapStateToProps)(mainPage);




export default connectedMainPage;
