import {VectorMap} from "@south-paw/react-vector-maps";
import React, {BaseSyntheticEvent, useState} from "react";
import s from './map.module.css'

import {dataGDP} from './mapState/stateGPD'
import {stateWithoutGDP} from './mapState/stateWithoutGPD'


function App() {
    const [hovered, setHovered] = useState<string>('None');
    const [selected, setSelected] = useState<Array<{ id: string, name: string, gdp: string }>>([]);

    const addGDPInState = (stateWithoutGDP: any, dataGdp: any) => {
        let stateCopy = {...stateWithoutGDP}
        let dataGDPCopy = [...dataGdp]

        for (let i = 0; i < stateWithoutGDP.layers.length; i++) {
            let findGDP = dataGDPCopy.find(el =>
                el.country.toUpperCase() === stateCopy.layers[i].name.toUpperCase())
            if (findGDP) {
                stateCopy.layers[i] = {
                    ...stateCopy.layers[i], gdp: dataGDPCopy[i].gdpPerCapita
                }
            }
        }
        return stateCopy
    }

    let combinedState = addGDPInState(stateWithoutGDP, dataGDP)

    const averageGDP = selected.reduce((acc, country) => acc + Number(country.gdp) / selected.length, 0);


    const layerProps = {
        onMouseEnter: (e: BaseSyntheticEvent) => setHovered(e.target.attributes.name.value),
        onMouseLeave: () => setHovered('None'),
        onClick: (e: BaseSyntheticEvent) => {
            const clickedName = e.target.attributes.name.value
            const id = e.target.attributes.id.nodeValue
            const gdp = e.target.attributes.gdp.nodeValue
            const findId = selected.find(c => c.name === clickedName)
            if (!findId) {
                debugger
                if (selected.length < 3) {
                    setSelected([...selected, {id: id, name: clickedName, gdp: gdp}])
                }
            }
        }
    }


    return (
        <div className={s.mapBox}>
            <div className={s.map}>
                <p>{hovered}</p>
                <hr/>
                <VectorMap {...combinedState} layerProps={layerProps}/>
            </div>
            <div className={s.tableBox}>
                <table>
                    <caption>Selected country</caption>
                    <tbody>
                    <tr>
                        <th>country</th>
                        <th>GDP per capital</th>
                    </tr>
                    {selected.map(el =>
                        <tr key={el.id}>
                            <td>{el.name}</td>
                            <td>{el.gdp + " $"}</td>
                        </tr>
                    )}
                    <tr style={{backgroundColor: "darkkhaki"}}>
                        <th>average GDP :</th>
                        <th>{averageGDP.toFixed(3) + " $"}</th>
                    </tr>
                    </tbody>
                </table>
                <div className={s.button}>
                    <button onClick={() => setSelected([])}>clear table</button>
                </div>
            </div>
        </div>
    )
}

export default App;
