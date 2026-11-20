/* filepath: c:\Users\thiagoandre\Desktop\laragon-6.0.0\www\adote\scripts.js */
// Carousel functionalitydocument.addEventListener('DOMContentLoaded', function () {    let beerSliderInstances = new Map();

    // Initialize BeerSlider for a specific element
    function initializeBeerSlider(sliderElement, index) { // Renamed 'slider' to 'sliderElement' to avoid conflict
        // Check if already initialized
        if (beerSliderInstances.has(sliderElement)) {
            return beerSliderInstances.get(sliderElement);
        }

        // Initialize new BeerSlider
        const instance = new BeerSlider(sliderElement, {
            start: 50
        });

        beerSliderInstances.set(sliderElement, instance);
        return instance;
    }

    // REMOVE THE INITIAL GLOBAL INITIALIZATION AND STYLE OVERRIDE
    // initializeBeerSliders(); // REMOVE THIS LINE
    /* document.querySelectorAll('.beer-slider .beer-reveal img').forEach(img => { // REMOVE THIS BLOCK
      img.style.transform = 'none';
      img.style.transition = 'none';
      img.style.left = '0';
      img.style.position = 'static';
    }); */

    // Carousel functionality
    const slideIds = [
        'jardinete-railto', 'engenheiro-raul', 'largo-erasmo', 'largo-jose',
        'jardinete-1475', 'jardinete-ervin', 'jardinete-luiz'
    ];
    const sliders = document.querySelectorAll('.beer-slider');
    const dots = document.querySelectorAll('.carousel-dot');
    const infoCards = document.querySelectorAll('.slide-info-card');
    const prevButton = document.querySelector('.prev-slide-btn');
    const nextButton = document.querySelector('.next-slide-btn');
    let currentIndex = 0;
    const totalSlides = sliders.length;

    // Adjust spacing for carousel dots - much more space from text below
    dots.forEach(dot => {
        dot.style.marginTop = '30px'; // More space above dots from the content
        dot.style.marginBottom = '10px'; // Much more space below dots from text
    });

    // Enhance info cards: adjust existing tree icon and title padding
    infoCards.forEach(card => {
        // Find and adjust the existing slide-icon
        const iconContainer = card.querySelector('.slide-icon');
        if (iconContainer) {
            const treeIcon = iconContainer.querySelector('i.fas.fa-tree');
            if (treeIcon) {
                // Keep original icon size (remove the fontSize change)
                // treeIcon.style.fontSize = '18px'; // REMOVE THIS LINE
                iconContainer.style.marginRight = '12px'; // Space between icon and title
                iconContainer.style.display = 'inline-block';
                iconContainer.style.verticalAlign = 'middle';
            }
        }

        // Adjust title padding
        const titleElement = card.querySelector('h1, h2, h3, h4, h5, h6');
        if (titleElement) {
            // Move icon to beginning of title if it's not already there
            if (iconContainer && !titleElement.contains(iconContainer)) {

                titleElement.prepend(iconContainer);
            }

            // Increase padding between title and descriptive text
            titleElement.style.marginBottom = '20px'; // More space after title
        }
    });

    // Navigation buttons positioning comment:
    // To move navigation buttons between photo and description box:
    // 1. In your HTML, wrap the buttons in a container div
    // 2. Position this container between the slider and info card elements
    // 3. Add CSS for proper spacing, e.g.:
    //    .nav-buttons-container { margin: 20px 0; text-align: center; }

    function setActiveSlide(index) {
        if (index < 0 || index >= totalSlides || totalSlides === 0) {
            if (prevButton) prevButton.disabled = true;
            if (nextButton) nextButton.disabled = true;
            return;
        }
        currentIndex = index;

        sliders.forEach((sliderElement, i) => { // Renamed 'slider' to 'sliderElement'
            if (i === index) {
                sliderElement.style.opacity = '0'; // Prepare for fade-in
                sliderElement.classList.add('active');

                // Initialize BeerSlider if it's the first time this slide is active
                if (!beerSliderInstances.has(sliderElement)) {
                    initializeBeerSlider(sliderElement, i);
                }

                setTimeout(() => {
                    sliderElement.style.opacity = '1';
                    // Force remove transform from reveal image AFTER it's visible and initialized
                    const revealImg = sliderElement.querySelector('.beer-reveal img');
                    if (revealImg) {
                        // Using setProperty to correctly apply !important
                        revealImg.style.setProperty('transform', 'none', 'important');
                        // It's usually best to avoid overriding transition and position unless absolutely necessary
                        // as they might be part of the library's core functionality.
                        // The main issue seems to be the 'transform'.
                    }
                }, 50); // Small delay for visibility and initialization
            } else {
                sliderElement.classList.remove('active');
                sliderElement.style.opacity = '0';
            }
        });

        infoCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        if (prevButton) {
            prevButton.disabled = (currentIndex === 0);
        }
        if (nextButton) {
            nextButton.disabled = (currentIndex === totalSlides - 1);
        }
    }

    function showPrevSlide() {
        if (currentIndex > 0) {
            setActiveSlide(currentIndex - 1);

            const showcaseSection = document.querySelector('.showcase-section');
            if (showcaseSection) {
                showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    function showNextSlide() {
        if (currentIndex < totalSlides - 1) {
            setActiveSlide(currentIndex + 1);
            const showcaseSection = document.querySelector('.showcase-section');
            if (showcaseSection) {
                showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            setActiveSlide(index);
            const showcaseSection = document.querySelector('.showcase-section');
            if (showcaseSection) {
                showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', showPrevSlide);
    }
    if (nextButton) {
        nextButton.addEventListener('click', showNextSlide);
    }

    function initializePage() {
        const hash = location.hash.replace('#', '');
        let initialSlideIndex = -1;
        if (hash && slideIds.includes(hash)) {
            initialSlideIndex = slideIds.indexOf(hash);
        }

        if (totalSlides > 0) {
            if (initialSlideIndex !== -1) {
                setActiveSlide(initialSlideIndex);
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        const showcaseSection = document.querySelector('.showcase-section');
                        if (showcaseSection && showcaseSection.contains(element)) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else if (showcaseSection) {
                            showcaseSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        const showcaseSection = document.querySelector('.showcase-section');
                        if (showcaseSection) showcaseSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                setActiveSlide(0);
            }
        } else {
            if (prevButton) prevButton.disabled = true;
            if (nextButton) nextButton.disabled = true;
        }
    }

    initializePage();
});
// Hamburger menu functionalitydocument.getElementById("hamburger-menu").addEventListener("click", function () {    const navMenu = document.getElementById("nav-menu");
    const hamburger = this;
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});
// Close menu when clicking on link (for mobile)document.querySelectorAll('.nav-links a').forEach(link => {    link.addEventListener('click', () => {
        const navMenu = document.getElementById("nav-menu");
        const hamburger = document.getElementById("hamburger-menu");
        if (window.innerWidth <= 768) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });
});
// Mapaconst mapElement = document.getElementById('map');const mapOverlay = document.querySelector('.map-overlay');const map = L.map('map', {    scrollWheelZoom: false,
    touchZoom: false,
    dragging: false
}).setView([-25.4284, -49.2733], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {    attribution: '© OpenStreetMap contributors'
}).addTo(map);
const disponivelLayer = L.layerGroup().addTo(map);const adotadaLayer = L.layerGroup().addTo(map);const especialLayer = L.layerGroup().addTo(map);
const overlayMaps = {    '<span style="color: #0B56A4;">📍 Disponível para Adoção</span>': disponivelLayer,
    '<span style="color: #34D399;">📍 Adotada</span>': adotadaLayer,
    '<span style="color: #F59E0B;">📍 Indisponível para Adoção</span>': especialLayer
};
const CustomLayerControl = L.Control.Layers.extend({    onAdd: function (map) {
        const container = L.Control.Layers.prototype.onAdd.call(this, map);
        const title = L.DomUtil.create('div', 'custom-layer-title');
        title.innerHTML = '<h6 style="color: #0B56A4; font-weight: bold; margin: 0; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-size: 13px;">Filtrar por disponibilidade</h6>';
        container.insertBefore(title, container.firstChild);
        return container;
    }
});
const layerControl = new CustomLayerControl(null, overlayMaps, {    position: 'topright',
    collapsed: false
}).addTo(map);
function createCustomIcon(color, zIndexOffset = 0) {    return L.divIcon({
        className: 'custom-pin-marker',
        html: `<div style="
      position: relative;      width: 30px;      height: 40px;      z-index: ${1000 + zIndexOffset};    ">      <div style="        position: absolute;
        top: 0;        left: 50%;        transform: translateX(-50%);        width: 30px;        height: 30px;        background-color: ${color};        border-radius: 50% 50% 50% 0;        transform: translateX(-50%) rotate(-45deg);        border: 3px solid white;        box-shadow: 0 3px 8px rgba(0,0,0,0.4);      "></div>      <div style="        position: absolute;        top: 6px;        left: 50%;        transform: translateX(-50%);        width: 12px;        height: 12px;        background-color: white;        border-radius: 50%;        z-index: 1;      "></div>    </div>`,        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
    });
}
const disponivelIcon = createCustomIcon('#0B56A4', 0);const adotadaIcon = createCustomIcon('#34D399', 100);const especialIcon = createCustomIcon('#F59E0B', 50);
const regionalBairroMap = {    "BOA VISTA": ["ABRANCHES", "ATUBA", "BACACHERI", "BAIRRO ALTO", "BARREIRINHA", "BOA VISTA", "CACHOEIRA", "PILARZINHO", "SANTA CÂNDIDA", "SÃO LOURENÇO", "TABOÃO", "TARUMÃ", "TINGUI"],
    "BOQUEIRÃO": ["ALTO BOQUEIRÃO", "BOQUEIRÃO", "HAUER", "XAXIM"],
    "CAJURU": ["CAJURU", "CAPÃO DA IMBUIA", "GUABIROTUBA", "JARDIM DAS AMÉRICAS", "UBERABA"],
    "CIC": ["AUGUSTA", "CIDADE INDUSTRIAL DE CURITIBA", "RIVIERA", "SÃO MIGUEL"],
    "MATRIZ": ["AHÚ", "ALTO DA GLÓRIA", "ALTO DA RUA XV", "BATEL", "BIGORRILHO", "BOM RETIRO", "CABRAL", "CENTRO", "CENTRO CÍVICO", "CRISTO REI", "HUGO LANGE", "JARDIM BOTÂNICO", "JARDIM SOCIAL", "JUVEVÊ", "MERCÊS", "PRADO VELHO", "REBOUÇAS", "SÃO FRANCISCO"],
    "PINHEIRINHO": ["CAPÃO RASO", "FANNY", "GUAÍRA", "LINDÓIA", "NOVO MUNDO", "PINHEIRINHO"],
    "PORTÃO": ["ÁGUA VERDE", "FAZENDINHA", "GUAÍRA", "PAROLIN", "PORTÃO", "SANTA QUITÉRIA", "SEMINÁRIO", "VILA IZABEL"],
    "SANTA FELICIDADE": ["BUTIATUVINHA", "CAMPINA DO SIQUEIRA", "CAMPO COMPRIDO", "CASCATINHA", "LAMENHA PEQUENA", "MOSSUNGUÊ", "ORLEANS", "SANTA FELICIDADE", "SANTO INÁCIO", "SÃO BRAZ", "SÃO JOÃO", "VISTA ALEGRE"],
    "TATUQUARA": ["CAMPO DE SANTANA", "CAXIMBA", "TATUQUARA"],
    "BAIRRO NOVO": ["GANCHINHO", "SÍTIO CERCADO", "UMBARÁ"]
};
const allBairros = [...new Set(Object.values(regionalBairroMap).flat())]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
const allRegionais = Object.keys(regionalBairroMap)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

const regionalSelect = document.getElementById('regionalSelect');const bairroSelect = document.getElementById('bairroSelect');let pontos = [];let markers = [];
regionalSelect.innerHTML = '<option value="">Todas</option>' + allRegionais.map(r => `<option value="${r}">${r}</option>`).join('');
function popularBairros(regionalSelecionada) {    let bairrosOptions = '<option value="">Todos</option>';
    if (regionalSelecionada && regionalBairroMap[regionalSelecionada]) {
        bairrosOptions += regionalBairroMap[regionalSelecionada].sort().map(b => `<option value="${b}">${b}</option>`).join('');
    } else {
        bairrosOptions += allBairros.map(b => `<option value="${b}">${b}</option>`).join('');
    }
    bairroSelect.innerHTML = bairrosOptions;
}
regionalSelect.addEventListener('change', () => {    const regionalSelecionada = regionalSelect.value;
    popularBairros(regionalSelecionada);
    plotPontos();

    if (!mapOverlay.classList.contains('hidden')) {
        mapOverlay.classList.add('hidden');
        map.scrollWheelZoom.enable();
        map.touchZoom.enable();
        map.dragging.enable();
        mapElement.focus();
    }
});
bairroSelect.addEventListener('change', () => {    plotPontos();
    if (!mapOverlay.classList.contains('hidden')) {
        mapOverlay.classList.add('hidden');
        map.scrollWheelZoom.enable();
        map.touchZoom.enable();
        map.dragging.enable();
        mapElement.focus();
    }
});
function plotPontos() {    disponivelLayer.clearLayers();
    adotadaLayer.clearLayers();
    especialLayer.clearLayers();
    markers = [];

    const regionalFiltro = regionalSelect.value;
    const bairroFiltro = bairroSelect.value;

    const pontosDisponiveis = [];
    const pontosAdotados = [];
    const pontosEspeciais = [];

    pontos.forEach(p => {
        const regionalPonto = p.regional.split('/')[0].trim();
        const regionalMatch = regionalFiltro === '' || regionalPonto.toUpperCase() === regionalFiltro.toUpperCase();
        const bairroMatch = bairroFiltro === '' || p.bairro.toUpperCase() === bairroFiltro.toUpperCase();

        if (regionalMatch && bairroMatch) {
            if (p.status && p.status.toUpperCase() === 'ADOTADA') {
                pontosAdotados.push(p);
            } else if (p.status && p.status.toUpperCase().includes('ESPECIAL') && p.status.toUpperCase().includes('INDISPONÍVEL')) {
                pontosEspeciais.push(p);
            } else {
                pontosDisponiveis.push(p);
            }
        }
    });

    pontosDisponiveis.forEach(p => {
        let popupContent = '';
        if (p.categoria) {
            popupContent += `<div style="font-weight: bold; color: #0B56A4; margin-bottom: 5px;">${p.categoria}</div>`;
        }
        popupContent += `<div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${p.name}</div>`;

        if (p.bairro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Bairro:</strong> ${p.bairro}</div>`;
        }

        if (p.logradouro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong></strong> ${p.logradouro}</div>`;
        }

        if (p.endereco) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Endereço:</strong> ${p.endereco}</div>`;
        }
        if (p.codigo) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Código do espaço:</strong> ${p.idlocal}</div>`;
        }

        if (p.modalidade) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 12px;"><strong>Modalidade:</strong> ${p.modalidade}</div>`;
        }

        popupContent += `<div style="display: flex; gap: 8px; flex-wrap: wrap;">`;

        popupContent += `<a href="https://servicodigital.curitiba.pr.gov.br/servico/i/68b1bd45c7088f00528e80d6/5e021cbb0309d26aacc8ed8e/servicos-digitais+adocao-de-pracas?subject=${encodeURIComponent(p.idlocal)}" target="_blank" style="display: inline-block; background-color: #34D399; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Adotar</span></a>`;
        popupContent += `<a href="https://www.google.com/maps?q=${p.lat},${p.lng}&z=20" target="_blank" style="display: inline-block; background-color: #0B56A4; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Ver no Mapa</span></a>`;        popupContent += `<a href="https://www.curitiba.pr.gov.br/locais/titulo/${p.idlocal}" target="_blank" style="display: inline-block; background-color: #F59E0B; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Detalhes</span></a>`;
        popupContent += `</div>`;

        const marker = L.marker([p.lat, p.lng], {
            icon: disponivelIcon,
            zIndexOffset: 0
        }).bindPopup(popupContent);
        disponivelLayer.addLayer(marker);
        markers.push(marker);
    });

    pontosAdotados.forEach(p => {
        let popupContent = '';
        if (p.categoria) {
            popupContent += `<div style="font-weight: bold; color: #0B56A4; margin-bottom: 5px;">${p.categoria}</div>`;
        }
        popupContent += `<div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${p.name}</div>`;

        if (p.bairro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Bairro:</strong> ${p.bairro}</div>`;
        }

        if (p.logradouro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Rua:</strong> ${p.logradouro}</div>`;
        }

        if (p.endereco) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Endereço:</strong> ${p.endereco}</div>`;
        }

        if (p.adotante && p.adotante.trim() !== '') {
            popupContent += `<div style="color: #34D399; font-size: 14px; font-weight: 600; margin-bottom: 4px; padding: 4px 8px; background: rgba(52, 211, 153, 0.1); border-radius: 5px; border-left: 3px solid #34D399;"><strong>👤 Adotante:</strong><br><span style="font-weight: normal;">${p.adotante}</span></div>`;
        }
        if (p.inicio && p.inicio.trim() !== '') {
            popupContent += `<div style="color: #059669; font-size: 14px; margin-bottom: 4px; padding: 3px 6px; background: rgba(5, 150, 105, 0.05); border-radius: 3px;"><strong>📅 Início da Adoção:</strong> ${p.inicio}</div>`;
        }
        if (p.fim && p.fim.trim() !== '') {
            popupContent += `<div style="color: #059669; font-size: 14px; padding: 3px 6px; margin-bottom: 12px; background: rgba(5, 150, 105, 0.05); border-radius: 3px;"><strong>📆 Fim da Adoção:</strong> ${p.fim}</div>`;
        }

        popupContent += `<a href="https://www.google.com/maps?q=${p.lat},${p.lng}&z=20" target="_blank" style="display: inline-block; background-color: #0B56A4; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Ver no Mapa</span></a>`;        popupContent += `<a href="https://www.curitiba.pr.gov.br/locais/titulo/${p.idlocal}" target="_blank" style="display: inline-block; background-color: #F59E0B; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Detalhes</span></a>`;
        const marker = L.marker([p.lat, p.lng], {
            icon: adotadaIcon,
            zIndexOffset: 1000
        }).bindPopup(popupContent);
        adotadaLayer.addLayer(marker);
        markers.push(marker);
    });

    pontosEspeciais.forEach(p => {

        let popupContent = '';
        if (p.categoria) {
            popupContent += `<div style="font-weight: bold; color: #F59E0B; margin-bottom: 5px;">${p.categoria}</div>`;
        }
        popupContent += `<div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${p.name}</div>`;

        if (p.bairro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Bairro:</strong> ${p.bairro}</div>`;
        }

        if (p.logradouro) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Rua:</strong> ${p.logradouro}</div>`;
        }

        if (p.endereco) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Endereço:</strong> ${p.endereco}</div>`;
        }

        if (p.codigo) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 4px;"><strong>Código do espaço:</strong> ${p.idlocal}</div>`;
        }

        if (p.modalidade) {
            popupContent += `<div style="color: #666; font-size: 14px; margin-bottom: 12px;"><strong>Modalidade:</strong> ${p.modalidade}</div>`;
        }

        popupContent += `<div style="color: #F59E0B; font-size: 14px; font-weight: 600; margin-bottom: 10px; padding: 4px 8px; background: rgba(245, 158, 11, 0.1); border-radius: 5px; border-left: 3px solid #F59E0B;">
      <strong>⚠️ Este espaço não está disponível para adoção</strong>    </div>`;
        popupContent += `<a href="https://www.google.com/maps?q=${p.lat},${p.lng}&z=20" target="_blank" style="display: inline-block; background-color: #0B56A4; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
      <span style="vertical-align: middle;">Ver no Mapa</span>    </a>`;        popupContent += `<a href="https://www.curitiba.pr.gov.br/locais/titulo/${p.idlocal}" target="_blank" style="display: inline-block; background-color: #F59E0B; color: white; padding: 6px 16px; margin-top: 8px; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">
<span style="vertical-align: middle;">Detalhes</span></a>`;
        const marker = L.marker([p.lat, p.lng], {
            icon: especialIcon,
            zIndexOffset: 50
        }).bindPopup(popupContent);
        especialLayer.addLayer(marker);
        markers.push(marker);
    });

    if (markers.length > 0) {
        const featureGroup = L.featureGroup(markers);
        map.fitBounds(featureGroup.getBounds().pad(0.1));
    }
}

const isLocalhost = window.location.hostname === 'localhost';

const csvPath = isLocalhost
    ? 'Include/js/pracas_jardinetes_v5.csv'
    : 'https://adoteumapraca.curitiba.pr.gov.br/LandingPage/AdoteUmaPraca/Include/js/pracas_jardinetes_v5.csv';

const basePath = isLocalhost
    ? "/landingpage/adoteumapraca/Include/Design/img/"
    : "https://adoteumapraca.curitiba.pr.gov.br/landingpage/adoteumapraca/Include/Design/img/";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        if (img.getAttribute("data-img")) {
            img.src = basePath + img.getAttribute("data-img");
        }
    });
});

fetch(csvPath)    .then(response => response.text())

    .then(csv => {
        const delimiter = csv.includes(';') ? ';' : ',';
        const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return;

        const header = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
        const latIndex = header.findIndex(h => h === 'latitude' || h === 'lat');
        const lngIndex = header.findIndex(h => h === 'longitude' || h === 'lon' || h === 'long');
        const nameIndex = header.findIndex(h => h === 'nome' || h === 'name');
        const regionalIndex = header.findIndex(h => h === 'regional');
        const bairroIndex = header.findIndex(h => h === 'bairro');
        const statusIndex = header.findIndex(h => h === 'status');
        const categoriaIndex = header.findIndex(h => h === 'categoria');
        const modalidadeIndex = header.findIndex(h => h === 'modalidade');
        const idlocalIndex = header.findIndex(h => h === 'idlocal');
        const codigoIndex = header.findIndex(h => h === 'codigo');
        const adotanteIndex = header.findIndex(h => h === 'adotante');
        const inicioIndex = header.findIndex(h => h === 'inicio');
        const fimIndex = header.findIndex(h => h === 'fim');
        const enderecoIndex = header.findIndex(h => h === 'endereco' || h === 'address');
        const logradouroIndex = header.findIndex(h => h === 'logradouro');

        if (latIndex === -1 || lngIndex === -1 || nameIndex === -1) {
            console.error('Colunas Latitude, Longitude e Nome não encontradas no CSV.');
            return;
        }

        function parseCSVLine(line, delimiter) {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === delimiter && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            result.push(current.trim());
            return result;
        }

        function formatarTexto(texto) {
            if (!texto) return '';

            const preposicoes = ['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'e', 'a', 'o', 'as', 'os'];

            return texto.toLowerCase().split(' ').map((palavra, index) => {
                if (preposicoes.includes(palavra) && index !== 0) {
                    return palavra;
                }
                return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            }).join(' ');
        }

        pontos = [];
        for (let i = 1; i < lines.length; i++) {
            const columns = parseCSVLine(lines[i], delimiter);

            if (columns.length < Math.max(latIndex, lngIndex, nameIndex, regionalIndex, bairroIndex, statusIndex, categoriaIndex, modalidadeIndex, idlocalIndex, codigoIndex, adotanteIndex, inicioIndex, fimIndex, enderecoIndex, logradouroIndex) + 1) continue;

            let lat = columns[latIndex] ? parseFloat(columns[latIndex].replace(',', '.')) : NaN;
            let lng = columns[lngIndex] ? parseFloat(columns[lngIndex].replace(',', '.')) : NaN;

            if (isNaN(lat) || isNaN(lng)) {
                continue;
            }

            let name = columns[nameIndex] ? columns[nameIndex].replace(/"/g, '') : 'Nome não disponível';

            let regional = regionalIndex !== -1 && columns[regionalIndex] ? columns[regionalIndex].replace(/"/g, '') : '';
            let bairro = bairroIndex !== -1 && columns[bairroIndex] ? formatarTexto(columns[bairroIndex].replace(/"/g, '')) : '';
            let status = statusIndex !== -1 && columns[statusIndex] ? columns[statusIndex].replace(/"/g, '') : 'DISPONÍVEL PARA ADOÇÃO';
            let categoria = categoriaIndex !== -1 && columns[categoriaIndex] ? columns[categoriaIndex].replace(/^AVL - /i, '').replace(/"/g, '') : '';
            let modalidade = modalidadeIndex !== -1 && columns[modalidadeIndex] ? columns[modalidadeIndex].replace(/"/g, '') : '';
            let idlocal = idlocalIndex !== -1 && columns[idlocalIndex] ? columns[idlocalIndex].replace(/"/g, '') : '';

            let codigo = codigoIndex !== -1 && columns[codigoIndex] ? columns[codigoIndex].replace(/"/g, '') : '';
            let adotante = adotanteIndex !== -1 && columns[adotanteIndex] ? columns[adotanteIndex].replace(/"/g, '') : '';
            let inicio = inicioIndex !== -1 && columns[inicioIndex] ? columns[inicioIndex].replace(/"/g, '') : '';
            let fim = fimIndex !== -1 && columns[fimIndex] ? columns[fimIndex].replace(/"/g, '') : '';
            let endereco = enderecoIndex !== -1 && columns[enderecoIndex] ? columns[enderecoIndex].replace(/"/g, '') : '';
            let logradouro = logradouroIndex !== -1 && columns[logradouroIndex] ? formatarTexto(columns[logradouroIndex].replace(/"/g, '')) : '';

            pontos.push({ lat, lng, name, regional, bairro, status, categoria, modalidade, idlocal, codigo, adotante, inicio, fim, endereco, logradouro });
        }
        popularBairros('');
        plotPontos();
    })
    .catch(error => console.error('Erro ao carregar ou processar dados do CSV:', error));

mapOverlay.addEventListener('click', () => {    mapOverlay.classList.add('hidden');
    mapElement.focus();
});
mapElement.addEventListener('focus', () => {    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
    map.dragging.enable();
});
mapElement.addEventListener('blur', () => {    setTimeout(() => {
        const focusedElement = document.activeElement;
        if (!mapElement.contains(focusedElement) && focusedElement !== mapOverlay) {
            map.scrollWheelZoom.disable();
            map.touchZoom.disable();
            map.dragging.disable();
            mapOverlay.classList.remove('hidden');
        }
    }, 0);
});
document.querySelectorAll('.nav-links a').forEach(anchor => {    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
window.addEventListener('scroll', () => {    const nav = document.querySelector('nav');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});
const observer = new IntersectionObserver(entries => {    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
