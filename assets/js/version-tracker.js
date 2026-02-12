/**
 * Sistema de Rastreamento de Versões de PDFs
 * Extrai versão do nome do arquivo e exibe badges com indicador "NOVO"
 */

class PDFVersionTracker {
    constructor() {
        this.storageKey = 'oer_pdf_versions';
        this.init();
    }

    /**
     * Inicializa o sistema
     */
    init() {
        // Aguarda DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBadges());
        } else {
            this.setupBadges();
        }
    }

    /**
     * Extrai versão do nome do arquivo
     * Formatos suportados: _v2.pdf, _v2, _2.pdf, _2
     */
    extractVersion(filename) {
        // Remove extensão se houver
        const nameWithoutExt = filename.replace(/\.pdf$/i, '');
        
        // Tenta padrões: _v2, _2, v2
        const patterns = [
            /_v(\d+)$/i,  // _v2
            /_(\d+)$/,    // _2
            /v(\d+)$/i    // v2
        ];

        for (const pattern of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null; // Sem versão encontrada
    }

    /**
     * Obtém nome base do PDF (sem versão)
     */
    getBaseName(filename) {
        return filename
            .replace(/\.pdf$/i, '')
            .replace(/_v?\d+$/i, '');
    }

    /**
     * Carrega versões salvas do localStorage
     */
    loadSavedVersions() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Erro ao carregar versões salvas:', e);
            return {};
        }
    }

    /**
     * Salva versões no localStorage
     */
    saveVersions(versions) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(versions));
        } catch (e) {
            console.warn('Erro ao salvar versões:', e);
        }
    }

    /**
     * Verifica se é uma nova versão
     */
    isNewVersion(baseName, currentVersion) {
        if (!currentVersion) return false;
        
        const savedVersions = this.loadSavedVersions();
        const savedVersion = savedVersions[baseName];
        
        if (!savedVersion) return true; // Primeira vez vendo
        
        return parseInt(currentVersion) > parseInt(savedVersion);
    }

    /**
     * Marca versão como vista
     */
    markAsSeen(baseName, version) {
        const versions = this.loadSavedVersions();
        versions[baseName] = version;
        this.saveVersions(versions);
    }

    /**
     * Cria elemento do badge
     */
    createBadge(version, isNew) {
        const badge = document.createElement('div');
        badge.className = 'version-badge' + (isNew ? ' new' : '');
        badge.innerHTML = `
            <div class="badge-star">
                <span class="badge-version">v${version}</span>
            </div>
            ${isNew ? '<span class="badge-new-label">NOVO</span>' : ''}
        `;
        return badge;
    }

    /**
     * Configura badges para todos os PDFs
     */
    setupBadges() {
        // Encontra todos os elementos com PDFs
        const pdfElements = document.querySelectorAll('[data-pdf-path]');
        
        pdfElements.forEach(element => {
            const pdfPath = element.getAttribute('data-pdf-path');
            const filename = pdfPath.split('/').pop();
            
            const version = this.extractVersion(filename);
            if (!version) return; // Sem versão no nome
            
            const baseName = this.getBaseName(filename);
            const isNew = this.isNewVersion(baseName, version);
            
            // Cria e adiciona badge
            const badge = this.createBadge(version, isNew);
            element.appendChild(badge);
            
            // Adiciona listener para marcar como visto ao clicar
            element.addEventListener('click', () => {
                this.markAsSeen(baseName, version);
                badge.classList.remove('new');
                const newLabel = badge.querySelector('.badge-new-label');
                if (newLabel) newLabel.remove();
            });
        });
    }
}

// Inicializa automaticamente
new PDFVersionTracker();
