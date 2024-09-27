import FormSelect from 'react-bootstrap/FormSelect';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import { getFractals, getIteration, getOptions, Fractals, FractalOptions } from "../Fractal/FractalOptions.mts";
import styles from './CSS/settings.module.css';

type setState<T> = React.Dispatch<React.SetStateAction<T>>;
const fractals = getFractals();

interface dropProps {
    fractal: Fractals;
    setFractal: setState<Fractals>;
    setIterations: setState<number>;
    disabled: boolean;
}

function FractalDropDown({fractal, setFractal, setIterations, disabled}:dropProps){

    const onChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
        const newFractal = e.target.value as Fractals;
        setFractal(newFractal);
        setIterations(getIteration(newFractal));
    }; 

    return (
        <FormSelect disabled={disabled} onChange={onChange} value={fractal}>
            {fractals.map((f) => {
                return <option key={f} value={f}>{f}</option>
            })}
        </FormSelect>
    );
}

interface iterationProps {
    options: FractalOptions | undefined;
    iteration: number;
    setIterations: setState<number>;
    disabled: boolean;
}
function IteraionDropDown({options, iteration, setIterations, disabled}:iterationProps){

    const onChange = (e:React.ChangeEvent<HTMLSelectElement>) => {setIterations(Number(e.target.value))};

    let iterations:number[] = [];
    if(options){
        const length = {length: options.maxIterations - options.minIterations + 1};
        iterations = Array.from(length, (_, i) => i + options.minIterations);
    }

    return (
        <FormSelect disabled={disabled} className={styles.m2} onChange={onChange} value={iteration}>
            {iterations.map((i) => {
                return <option key={i} value={i}>{i}</option>
            })}
        </FormSelect>
    );
}

interface buttonProps {
    options: FractalOptions | undefined;
    iteration: number;
    setIterations: setState<number>;
    disabled: boolean;
}
function Buttons({options, iteration, setIterations, disabled}:buttonProps){

    const disableMin = disabled || !options || iteration <= options.minIterations;
    const disableMax = disabled || !options || iteration >= options.maxIterations;

    return (
        <Stack direction="horizontal" gap={3} >
            <IteraionDropDown {...{options, iteration, setIterations, disabled}} />
            <InputGroup className="btn-group">
                <Button disabled={disableMin} variant="outline-danger" className={styles.button} onClick={() => {setIterations(iteration-1);}}>-</Button>
                <Button disabled={disableMax} variant="outline-primary" className={styles.button} onClick={() => {setIterations(iteration+1);}}>+</Button>
            </InputGroup>
        </Stack>
    );
}

interface prop {
    fractal: Fractals;
    setFractal: setState<Fractals>;
    iteration: number;
    setIterations: setState<number>;
    disabled: boolean;
}
export function Settings({fractal, setFractal, iteration, setIterations, disabled}:prop) {

    const options = getOptions(fractal);

    return (
        <Card data-bs-theme="dark" className={styles.opacity50}>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fractal</Form.Label>
                        <FractalDropDown {...{fractal, setFractal, setIterations, disabled}} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Iterations</Form.Label>
                        <Buttons {...{options, iteration, setIterations, disabled}} />
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    )
}