import React, { useEffect, useRef, useState } from 'react';
import { DropDownSelect } from '../controls/DropDownSelect';


export const ReportWizard = (props) => {
    const [l1Value, setL1Value] = React.useState(null);
    const [l2Value, setL2Value] = React.useState(null);

    return <><h1>TEST PAGE</h1>
        <div style={{ display: 'inline-block', verticalAlign: 'top', width: 300 }}>
            <DropDownSelect
                key="ddlList1"
                value={[{ id: 1 }]}
                placeholder={"List 1..."}
                onChange={setL1Value}
                items={[
                    { id: 1, value: 'Test 1 - with some really long text that should overflow' },
                    {
                        id: 2, value: 'Test 2', items: [
                            { id: 2.1, value: 'Test 2 - a' },
                            { id: 2.2, value: 'Test 2 - b' },
                            { id: 2.3, value: 'Test 2 - c' },
                            { id: 2.4, value: 'Test 2 - d' },
                            { id: 2.5, value: 'Test 2 - e' },
                            {
                                id: 2.6, value: 'Test 2 - f', items: [
                                    { id: 2.6, value: 'Test 2 - f - a' },
                                    { id: 2.6, value: 'Test 2 - f - b' }
                                ]
                            }
                        ]
                    },
                    { id: 3, value: 'Test 3' },
                    { id: 4, value: 'Test 4' },
                    { id: 5, value: 'Test 5' },
                ]}
            />
        </div>
        &nbsp;
        <div style={{ display: 'inline-block', verticalAlign: 'top', width: 300 }}>
            <DropDownSelect
                key="ddlList2"
                onChange={setL2Value}
                multiSelect
                placeholder={"List 2..."}
                items={[
                    { id: 1, value: 'Test 1a' },
                    {
                        id: 2, value: 'Test 2a',
                        selectable: false,
                        items: [
                            { id: 2.1, value: 'Test 2a - a' },
                            { id: 2.2, value: 'Test 2a - b' },
                            { id: 2.3, value: 'Test 2a - c' },
                            { id: 2.4, value: 'Test 2a - d' },
                            { id: 2.5, value: 'Test 2a - e' },
                            { id: 2.6, value: 'Test 2a - f' }
                        ]
                    },
                    { id: 3, value: 'Test 3a' },
                    { id: 4, value: 'Test 4a' },
                    { id: 5, value: 'Test 5a' },
                ]}
            />
        </div>
        <p>List 1:
            {JSON.stringify(l1Value)}
        </p>

        <p>List 2:
            {JSON.stringify(l2Value)}
        </p>
        <div style={{ height: 500 }}></div>
        <p>END OF PAGE</p>
    </>
}