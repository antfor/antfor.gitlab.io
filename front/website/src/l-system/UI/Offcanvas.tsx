import { Settings } from './Settings.tsx';
import styles from './CSS/settings.module.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import './CSS/hamburger.css';
import { Fractals } from '../Fractal/FractalOptions.mts';

type setState<T> = React.Dispatch<React.SetStateAction<T>>;

function HamburgerButton({show, setShow}: {show:boolean, setShow: setState<boolean>}) {

    const handleToggle = () => {setShow((prev) => !prev)};
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

interface props {
    fractalKey: Fractals;
    setFractalKey: setState<Fractals>;
    iteration: number;
    setIteration: setState<number>;
}
export function OffCanvas({fractalKey, setFractalKey, iteration, setIteration}:props) {
    
    const [show, setShow] = useState(true);
    const closed = show ? "": styles.close;
    
    return (
        <div className={`d-flex align-items-center ${closed} ${styles.container}`}>
             {Settings({fractal:fractalKey, setFractal:setFractalKey, iteration, setIterations:setIteration, disabled:!show})}
             {HamburgerButton({show, setShow})}
        </div>
    );
}