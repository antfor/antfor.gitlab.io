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


function MyNavbar(prop) {

  const activePage = prop.active;

  return (

    <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
    <Container fluid={true}>  
    <Navbar.Brand className="logo" href={activePage===PAGES.HOME? false: PAGES.HOME}>Anton Forsberg</Navbar.Brand>
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