import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

function App() {
    const [bodies, setBodies] = useState([]);
    const [filteredBodies, setFilteredBodies] = useState([]);
    const [selectedBodyInfo, setSelectedBodyInfo] = useState(null);
    const { register, watch } = useForm({
        defaultValues: {
            isPlanet: false,
            gravity: 1
        }
    });

    const isPlanet = watch('isPlanet');
    const gravity = watch('gravity');
    const [maxGravity, setMaxGravity] = useState(1);

    useEffect(() => {
        fetch('https://api.le-systeme-solaire.net/rest/bodies')
            .then(response => response.json())
            .then(data => {
                setBodies(data.bodies);
                setFilteredBodies(data.bodies);
                // Calcul de la valeur maximale de gravité
                const maxGravityValue = Math.max(...data.bodies.map(body => body.gravity));
                setMaxGravity(maxGravityValue);
            });
    }, []);

    useEffect(() => {
        // Filtrage des corps basé sur 'isPlanet' et 'gravity'
        const newFilteredBodies = bodies.filter(body => {
            return (isPlanet ? body.isPlanet : true) && body.gravity >= gravity;
        });
        setFilteredBodies(newFilteredBodies);
    }, [isPlanet, gravity, bodies]);

    const onSelectBody = (event) => {
        const bodyId = event.target.value;
        fetch(`https://api.le-systeme-solaire.net/rest/bodies/${bodyId}`)
            .then(response => response.json())
            .then(data => {
                setSelectedBodyInfo(data); // mettez à jour avec la vraie structure de votre API
            });
    };

    // Composant pour le rendu des informations du corps céleste sélectionné
    const BodyInfo = ({ info }) => (
        <div id="info">
            <h2>Information sur {info.englishName} ({info.name})</h2>
            <p><strong>Type de corps :</strong> {info.bodyType}</p>
            <p><strong>Est une planète :</strong> {info.isPlanet ? 'Oui' : 'Non'}</p>
            <p><strong>Volume :</strong> {info.vol.volValue} x 10^{info.vol.volExponent} km³</p>
            <p><strong>Densité :</strong> {info.density} g/cm³</p>
            <p><strong>Gravité :</strong> {info.gravity} m/s²</p>
            <p><strong>Température moyenne :</strong> {info.avgTemp} K</p>
            <p><strong>Découvert par :</strong> {info.discoveredBy || 'Inconnu'}</p>
            <p><strong>Date de découverte :</strong> {info.discoveryDate || 'Inconnue'}</p>
            <p><strong>Noms alternatifs :</strong> {info.alternativeName || 'Aucun'}</p>
            {/* Ajoutez d'autres informations que vous souhaitez afficher ici */}
        </div>
    );

    return (
        <div className="App">
            <h1>RHOBS Challenge</h1>
            <div className="input-container">
                <div className="range-and-checkbox">
                    <label className="checkbox-label">
                        <input type="checkbox" {...register('isPlanet')} />
                        Is Planet
                    </label>
                    <div className="gravity">
                        <input type="range" id="gravity" {...register('gravity')} max={maxGravity} />
                        <span className="gravity-label">Gravity</span>
                    </div>
                </div>
                <div className="bodies-selection">
                    <span>Bodies:</span>
                    <select {...register('body')} onChange={onSelectBody}>
                        {filteredBodies.map((body) => (
                            <option key={body.id} value={body.id}>{body.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedBodyInfo && <BodyInfo info={selectedBodyInfo} />}
        </div>
    );
}

export default App;