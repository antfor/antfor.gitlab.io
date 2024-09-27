import Card from 'react-bootstrap/Card';
import styles from './foreground.module.css';


export default function WelcomePill(){
    return(
        <div className={`${styles.foreground} d-flex align-items-center`}>
            <Card className={`${styles.helloCard} align-middle rounded-pill bg-light`}>
                <Card.Body>Hi! This is my website  :^)</Card.Body>
            </Card>
        </div>
    );
}