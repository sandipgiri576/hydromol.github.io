$(document).ready(function() {
    const searchInput = new URLSearchParams(window.location.search).get('search-input');

    const propertyNameMap = {
        'smiles_format': 'SMILE',
        'formula': 'Formula',
        'mol_wt': 'Molecular weight(g/mol)',
        // 'pubchem_status': 'Pubchem status',
        'PubChem_CID': 'Pubchem cid',
        'iupac_name': 'IUPAC name',
        'RotationalconstantA': 'Rotational constant A(cm-1)',
        'RotationalconstantB': 'Rotational constant B(cm-1)',
        'RotationalconstantC': 'Rotational constant C(cm-1)',
        'Dipolemoment': 'Dipole moment(Debye)',
        'HOMO': 'HOMO(eV)',
        'LUMO': 'LUMO(eV)',
        'EnergyGap': 'Energy Gap(eV)',
        'Zeropointenergy': 'Zeropoint energy(Eh)',
        'Finalsinglepointenergy': 'Singlepoint energy(Eh)',
        'Totalthermalenergy': 'Thermal energy(Eh)',
        'TotalEnthalpy': 'Enthalpy(Eh)',
        'Totalentropy': 'Entropy(Eh)',
        'Gibbsfreeenergy': 'Gibbs free energy(Eh)'    
    };

    let currentMolecule = null; // Store the currently displayed molecule

    $.getJSON('hyd.json', function(data) {
        const tableBody = $('#molecule-table tbody');
        const molecule = data.find(function(molecule) {
            return molecule.smiles_format.toLowerCase() === searchInput.toLowerCase();
        });

        if (molecule) {
            currentMolecule = molecule; // Save for download
            tableBody.empty();

            Object.entries(molecule).forEach(function([key, value]) {
                const row = $('<tr>');
                const mappedName = propertyNameMap[key] || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                row.append($('<th>').text(mappedName));
                row.append($('<td>').text(value));
                tableBody.append(row);
            });

            if (molecule.structure) {
                var filePath = "static/structure/" + molecule.structure;
                Jmol.script(jmolApplet0, 'load ' + filePath);
            }
        } else {
            window.location.href = '404.html';
        }
    });

    // Download XYZ button logic
    $('#download-xyz-btn').click(function() {
        if (!currentMolecule || !currentMolecule.structure) {
            alert('No XYZ structure file available for download.');
            return;
        }
        var filePath = "static/structure/" + currentMolecule.structure;
        var downloadAnchor = document.createElement('a');
        downloadAnchor.href = filePath;
        downloadAnchor.download = currentMolecule.structure; 
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    });
});
