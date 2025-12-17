import { useState } from 'react';
import { useTypo } from '../context/useTypo';

export const useConfigImport = () => {
    const { restoreConfiguration } = useTypo();
    const [missingFonts, setMissingFonts] = useState(null);
    const [pendingConfig, setPendingConfig] = useState(null);

    const validateAndRestore = (config) => {
        // Collect required files
        const requiredFiles = new Set();

        const collectFromStyle = (style) => {
            if (!style?.fonts) return;
            style.fonts.forEach(f => {
                if (f.fileName) {
                    requiredFiles.add(f.fileName);
                }
            });
        };

        collectFromStyle(config.fontStyles?.primary);
        collectFromStyle(config.fontStyles?.secondary);

        if (requiredFiles.size > 0) {
            setMissingFonts(Array.from(requiredFiles));
            setPendingConfig(config);
        } else {
            restoreConfiguration(config, {});
        }
    };

    const importConfig = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target.result);
                validateAndRestore(config);
            } catch (err) {
                console.error("Failed to parse config", err);
                alert("Invalid configuration file");
            }
        };
        reader.readAsText(file);
    };

    const handleResolveMissingFonts = (fileMap) => {
        if (pendingConfig) {
            restoreConfiguration(pendingConfig, fileMap);
            setMissingFonts(null);
            setPendingConfig(null);
        }
    };

    const cancelImport = () => {
        setMissingFonts(null);
        setPendingConfig(null);
    };

    return {
        importConfig,
        missingFonts,
        resolveMissingFonts: handleResolveMissingFonts,
        cancelImport
    };
};
