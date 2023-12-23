import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Assurez-vous que le fichier index.css est dans le même dossier
import App from './App'; // Assurez-vous que le fichier App.js est dans le même dossier

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
