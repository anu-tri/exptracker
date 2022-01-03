import React, { Component } from 'react'
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './NavBar.css'

export default class NavBar extends Component {
   
    render() {
        return (
            // #1a1a00
            <Navbar expand="lg" style={{marginBottom:"20px",backgroundColor: "white", height:"80px"}}>
                    <Container>
                        <img src="https://res.cloudinary.com/dzzbwxwsv/image/upload/v1639690212/expicon_uncup5.jpg" style={{width:"50px", height:"50px"}}></img>
                        <Navbar.Brand as={Link} to="/" style={{color:"black", fontWeight:"bold"}}>TrackIt</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {this.props.token ?
                            <>
                                <Nav.Link as={Link} to="/" style={{color:"black", fontSize:"16px"}}>Home</Nav.Link>
                                <Nav.Link as={Link} to="/logout" style={{color:"black", fontSize:"16px"}}>Logout</Nav.Link>
                    

                                
                                <NavDropdown title="Category" id="basic-nav-dropdown" className="drop-down-menu" >
                                        <NavDropdown.Item as={Link} to="/createcategory" style={{ color:"#1F77F3"}}>Add Category</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/managecategory" style={{ color:"#1F77F3"}}>Manage Category</NavDropdown.Item>
                                </NavDropdown>
                            <NavDropdown title="Expense" id="basic-nav-dropdown" style={{fontColor:"#33ffd6"}}>
                                    <NavDropdown.Item as={Link} to="/viewexpenses" style={{ color:"#1F77F3"}}>View Expense</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/createexpenses" style={{ color:"#1F77F3"}}>Add Expense</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/manageexpenses" style={{ color:"#1F77F3"}}>Manage Expense</NavDropdown.Item>
                                    {/* <NavDropdown.Item as={Link} to="/deleteexpenses" style={{fontSize:"15px", color:"#A64AC9"}}>Delete Expenses</NavDropdown.Item> */}
                            </NavDropdown>
                            <NavDropdown title="Budget" id="basic-nav-dropdown" style={{fontColor:"#33ffd6"}}>
                                    <NavDropdown.Item as={Link} to="/createbudget" style={{ color:"#1F77F3"}}>Add Budget</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/managebudget" style={{ color:"#1F77F3"}}>Manage Budget</NavDropdown.Item>
                                    {/* <NavDropdown.Item as={Link} to="/deleteexpenses" style={{fontSize:"15px", color:"#A64AC9"}}>Delete Expenses</NavDropdown.Item> */}
                            </NavDropdown>
                            <NavDropdown title="Reports" id="basic-nav-dropdown" style={{fontSize:"16px"}} className="drop-down-menu" >
                                    <NavDropdown.Item as={Link} to="/expensechart" style={{fontSize:"15px", color:"#1F77F3"}}>Expense Breakdown</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/incomechart" style={{fontSize:"15px", color:"#1F77F3"}}>Yearly Budget Overview</NavDropdown.Item>
                                    
                            </NavDropdown>
                                </>
                            :
                            <>
                                <Nav.Link as={Link} to="/login" style={{color:"black"}}>Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" style={{color:"black"}}>Register</Nav.Link>
                            </>
                            }
                     </Nav>
    
                     <p style={{color:'green',marginRight:"50px", marginTop:"19px"}}>{this.props.userFullName ? this.props.userFullName : localStorage.getItem("name")}</p>            
                       
                      </Navbar.Collapse>
                    </Container>
                </Navbar>

        )
    }
}
