import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PAGES from './Pages.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faGooglePlay } from '@fortawesome/free-brands-svg-icons'



function githubIcon(){
  return  <FontAwesomeIcon icon={faGithub}/>;
}

function playStoreIcon(){
  return  <FontAwesomeIcon icon={faGooglePlay}/>;
}

const Top = "top";
const Height = 84; //84.5px

function setPaddingTop(fixed){
  const offset = fixed === Top ? Height+"px" : "0px";
  document.body.style.paddingTop = offset;

}

function MyNavbar(prop) {

  const activePage = prop.active;
  const fixed = prop.fixed === "false" ? undefined : Top; 

  setPaddingTop(fixed);

  return (

    <Navbar expand="md" fixed={fixed} className="bg-body-tertiary">
    <Container fluid={true}>  
    <Navbar.Brand className="logo" href={activePage===PAGES.HOME? undefined: PAGES.HOME}>Anton Forsberg</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link disabled={activePage===PAGES.HOME} href={PAGES.HOME}>Home</Nav.Link>
          <Nav.Link disabled={activePage===PAGES.CV}   href={PAGES.CV}>CV</Nav.Link>
          <Nav.Link href={PAGES.STORE}> {playStoreIcon()} Google Play </Nav.Link>
          <Nav.Link href={PAGES.GITHUB}> {githubIcon()} Github</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
    </Navbar>
  )
}

export default MyNavbar;