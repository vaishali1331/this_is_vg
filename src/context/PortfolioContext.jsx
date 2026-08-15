import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * @typedef {'ASK' | 'AGENT'} InnDocsMode
 * @typedef {'currently' | 'taste' | 'offline' | 'want'} AboutKey
 *
 * @typedef {Object} PortfolioContextValue
 * @property {InnDocsMode} innDocsMode - Active InnDocs runtime mode in the write-up.
 * @property {(mode: InnDocsMode) => void} setInnDocsMode - Flip ASK / AGENT (also used by the palette).
 * @property {AboutKey} aboutKey - Active about.yaml key (swaps the closer sentence).
 * @property {(key: AboutKey) => void} setAboutKey
 * @property {boolean} paletteOpen - Whether the ⌘K command palette is visible.
 * @property {() => void} openPalette
 * @property {() => void} closePalette
 * @property {() => void} togglePalette
 */

/** @type {React.Context<PortfolioContextValue | null>} */
const PortfolioContext = createContext(null);

/**
 * Shared UI state so the nav, InnDocs toggle, terminal, and command
 * palette can coordinate without prop-drilling through every section.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function PortfolioProvider({ children }) {
  const [innDocsMode, setInnDocsMode] = useState(/** @type {InnDocsMode} */ ('AGENT'));
  // Default `offline` so the existing cat / sketchbook / gym closer is
  // the first thing a visitor reads in About.
  const [aboutKey, setAboutKey] = useState(/** @type {AboutKey} */ ('offline'));
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((open) => !open), []);

  const value = useMemo(
    () => ({
      innDocsMode,
      setInnDocsMode,
      aboutKey,
      setAboutKey,
      paletteOpen,
      openPalette,
      closePalette,
      togglePalette,
    }),
    [innDocsMode, aboutKey, paletteOpen, openPalette, closePalette, togglePalette]
  );

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

/**
 * @returns {PortfolioContextValue}
 */
export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used inside <PortfolioProvider>');
  }
  return ctx;
}
