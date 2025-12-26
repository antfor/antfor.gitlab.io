import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { PAGES, page, PROJECTS } from './Pages.mts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import './css/hamburger3.css';
import navStyles from "./css/navbar.module.css";


function githubIcon() {
  return <FontAwesomeIcon icon={faGithub} />;
}

function playStoreIcon() {
  return <FontAwesomeIcon icon={faGooglePlay} />;
}

const Top = "top";
const Height = 84; //84.5px

function setPaddingTop(fixed: boolean) {
  const offset = fixed ? Height.toString() + "px" : "0px";
  document.body.style.paddingTop = offset;
}

function ProjectDropDown() {

  return (
    <NavDropdown menuVariant="dark" title="Projects">
      <NavDropdown.Item href={PROJECTS.Interest}>Compound Interest</NavDropdown.Item>
      <NavDropdown.Item href={PROJECTS.FRACTAL}>3D L-systems</NavDropdown.Item>
      <NavDropdown.Item href={PROJECTS.ORM}>One-Rep-Max</NavDropdown.Item>
      <NavDropdown.Item href={PROJECTS.Diet}>Diet</NavDropdown.Item>
    </NavDropdown>
  );
}

function Hamburger() {

  return (
    <div id="nav-hamburger-icon">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

interface props {
  active: null | page,
  fixed: boolean
}

export default function DefaultNavbar({ active, fixed }: props) {

  const activePage = active;
  const positon = fixed ? Top : undefined;

  setPaddingTop(fixed);

  return (
    <Navbar expand="md" fixed={positon} className="bg-body-tertiary">
      <Container fluid={true}>
        <Navbar.Brand className={navStyles.logo} href={activePage === PAGES.HOME ? undefined : PAGES.HOME}>Anton Forsberg</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"> <Hamburger /> </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link disabled={activePage === PAGES.HOME} href={PAGES.HOME}>Home</Nav.Link>
            <Nav.Link disabled={activePage === PAGES.CV} href={PAGES.CV}>CV</Nav.Link>
            <ProjectDropDown />
            <Nav.Link href={PAGES.STORE}> {playStoreIcon()} Google Play </Nav.Link>
            <Nav.Link href={PAGES.GITHUB}> {githubIcon()} Github</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}