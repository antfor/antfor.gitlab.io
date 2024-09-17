import { Settings } from './Settings.jsx';
import styles from './CSS/settings.module.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import './CSS/hamburger.css';


function HamburgerButton(show, setShow){

    const handleToggle = () => setShow((prev) => !prev);
    const open = show ? "open": "";

    return (
        <Button onClick={handleToggle} className={styles.showButton} variant="dark" >
            <div id="nav-icon1" className={open}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </Button>
    );
}

export function OffCanvas(fractalKey, setFractalKey, iteration, setIteration) {
    
    const [show, setShow] = useState(true);
    const closed = show ? "": styles.close;
    
    return (
        <div className={`d-flex align-items-center ${closed} ${styles.container}`}>
             {Settings(fractalKey, setFractalKey, iteration, setIteration, !show)}
             {HamburgerButton(show, setShow)}
        </div>
    );
}