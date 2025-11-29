import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { breakdownSettings } from '../defaultSettings.ts';

type key<T> = keyof T

interface propsBreakDown {
    settings: breakdownSettings,
    setSettings: (k: key<breakdownSettings>, v: boolean) => void,
}

export function BreakDownToggle({ settings, setSettings }: propsBreakDown) {

    const type = 'checkbox';
    const ib = settings.interestBreakdown;
    const ab = settings.accBreakdown;
    const iib = settings.interestOnInterestBreakdown;

    const key_ib = "interestBreakdown";
    const key_ab = "accBreakdown";
    const key_iib = "interestOnInterestBreakdown";

    return (
        <InputGroup className="xs-auto">

            <div key={`default-${type}`}>

                <Stack direction="horizontal" gap={5}>
                    <Form.Check
                        type={type}
                        checked={ib}
                        id={`interest`}
                        label={`info ränta`}
                        onChange={(e) => { setSettings(key_ib, e.target.checked) }}
                    />
                    <Form.Check
                        type={type}
                        checked={iib}
                        disabled={!ib}
                        id={`interestInterest`}
                        label={`info ränta på ränta`}
                        onChange={(e) => { setSettings(key_iib, e.target.checked) }}
                    />
                </Stack>
                <br />
                <Form.Check
                    type={type}
                    checked={ab}
                    id={`acc`}
                    label={`info insättning`}
                    onChange={(e) => { setSettings(key_ab, e.target.checked) }}
                />

            </div>
        </InputGroup>
    );
}